//+------------------------------------------------------------------+
//| TNV_WebBridge_EA.mq5                                             |
//| Reads TNV Indicator buffers and sends data to web                |
//| v1.10 - fix real ADX/VWAP, forward EMA, Wilder RSI/ATR           |
//| QUAN TRỌNG: trường InpSecretToken là PLACEHOLDER, KHÔNG commit token thật.|
//+------------------------------------------------------------------+
#property copyright "TNV"
#property version   "1.10"
#property description "Đọc dữ liệu từ TNV Indicator và gửi lên Website"

input group "=== WebBridge Configuration ===";
input string   InpIndicatorName = "TNV_Indicator"; // TNV Indicator filename (no .ex5)
input int      InpMAPeriod     = 20;     // Entry period for bias calc
input bool     InpWebEnabled   = true;   // Enable sending data to web
input string   InpWebUrl       = "https://tnvgold.vercel.app/api/pulse";
// KHÔNG đưa token thật vào repo - người dùng tự nhập, phải giống TNV_SECRET_KEY trên server
input string   InpSecretToken  = "REPLACE_WITH_YOUR_SECRET_TOKEN"; // Secret token (không commit token thật)

input group "=== Indicator Calculation ===";
input int      InpRSIPeriod    = 14;     // RSI period (Wilder)
input int      InpATRPeriod    = 14;     // ATR period (Wilder)
input int      InpADXPeriod    = 14;     // ADX period
input int      InpVWAPMaxBars  = 288;    // Max M5 bars scanned for daily VWAP

datetime g_last_candle = 0;
int      g_indicator_handle = INVALID_HANDLE;
int      g_rsi_handle  = INVALID_HANDLE;
int      g_atr_handle  = INVALID_HANDLE;
int      g_adx_handle  = INVALID_HANDLE;

//+------------------------------------------------------------------+
int OnInit()
{
   g_indicator_handle = iCustom(_Symbol, PERIOD_CURRENT, InpIndicatorName);
   if(g_indicator_handle == INVALID_HANDLE)
   {
      Print("[TNV EA] Không tìm thấy indicator: ", InpIndicatorName, ".ex5");
      Print("[TNV EA] Hãy đảm bảo indicator đã được compile và kéo lên chart.");
      return INIT_FAILED;
   }
   // Bộ chỉ báo chuẩn Wilder (ATR/RSI/ADX) giúp thay cho hằng số
   g_rsi_handle = iRSI(_Symbol, PERIOD_CURRENT, InpRSIPeriod, PRICE_CLOSE);
   g_atr_handle = iATR(_Symbol, PERIOD_CURRENT, InpATRPeriod);
   g_adx_handle = iADX(_Symbol, PERIOD_CURRENT, InpADXPeriod);
   Print("[TNV EA] Đã kết nối indicator: ", InpIndicatorName);
   return INIT_SUCCEEDED;
}

void OnDeinit(const int reason)
{
   if(g_indicator_handle != INVALID_HANDLE) IndicatorRelease(g_indicator_handle);
   if(g_rsi_handle  != INVALID_HANDLE) IndicatorRelease(g_rsi_handle);
   if(g_atr_handle  != INVALID_HANDLE) IndicatorRelease(g_atr_handle);
   if(g_adx_handle  != INVALID_HANDLE) IndicatorRelease(g_adx_handle);
}

//+------------------------------------------------------------------+
void OnTick()
{
   datetime candle_time = iTime(_Symbol, PERIOD_M5, 0);
   if(candle_time == g_last_candle) return;
   g_last_candle = candle_time;

   if(!InpWebEnabled) return;
   SendPulseToWeb();
}

//+------------------------------------------------------------------+
// Tính VWAP phiên ngày hiện tại (tích luỹ typical price * volume / volume)
double ComputeVWAP()
{
   MqlRates vr[];
   ArraySetAsSeries(vr, true);
   int n = CopyRates(_Symbol, PERIOD_CURRENT, 0, InpVWAPMaxBars, vr);
   if(n <= 1) return 0;

   int cur_day = (int)(vr[0].time / 86400);
   double cum_tpv = 0, cum_vol = 0;
   for(int i = 0; i < n; i++)
   {
      if((int)(vr[i].time / 86400) != cur_day) break;   // reset mỗi phiên/ngày
      double tp = (vr[i].high + vr[i].low + vr[i].close) / 3.0;
      double vol = (double)vr[i].tick_volume;
      if(vol > 0) { cum_tpv += tp * vol; cum_vol += vol; }
   }
   if(cum_vol <= 0) return 0;
   return cum_tpv / cum_vol;
}

//+------------------------------------------------------------------+
// EMA chạy XUÔI CHIỀU (quá khứ -> hiện tại). Trả về EMA tại nến hiện tại.
void ComputeEMA(const double &series[], int count, double &ema9, double &ema21)
{
   double m9 = 2.0/10, m21 = 2.0/22;
   ema9  = series[count-1];   // seed tại nến CŨ nhất
   ema21 = series[count-1];
   for(int i = count-2; i >= 0; i--)   // đệ quy xuôi về nến mới nhất (index 0)
   {
      ema9  = (series[i] - ema9)  * m9  + ema9;
      ema21 = (series[i] - ema21) * m21 + ema21;
   }
}

//+------------------------------------------------------------------+
void SendPulseToWeb()
{
   if(g_indicator_handle == INVALID_HANDLE) return;

   // Đọc buffer từ indicator (index 0=S1EntryHigh, 1=S1EntryLow, 2=S1ExitHigh, 3=S1ExitLow)
   double buf_entry_high[], buf_entry_low[], buf_exit_low[];
   ArraySetAsSeries(buf_entry_high, true);
   ArraySetAsSeries(buf_entry_low, true);
   ArraySetAsSeries(buf_exit_low, true);

   int copied1 = CopyBuffer(g_indicator_handle, 0, 0, 3, buf_entry_high);
   int copied2 = CopyBuffer(g_indicator_handle, 1, 0, 3, buf_entry_low);
   int copied3 = CopyBuffer(g_indicator_handle, 3, 0, 3, buf_exit_low);

   double high20 = (copied1 >= 3) ? buf_entry_high[1] : 0;
   double low20  = (copied2 >= 3) ? buf_entry_low[1] : 0;
   double exit10 = (copied3 >= 3) ? buf_exit_low[1] : 0;

   // Fallback nếu indicator buffer rỗng
   if(high20 <= 0 || low20 <= 0)
   {
      MqlRates rates[];
      ArraySetAsSeries(rates, true);
      if(CopyRates(_Symbol, PERIOD_M5, 0, 30, rates) < 25) return;
      high20 = rates[1].high; low20 = rates[1].low;
      for(int i = 1; i <= 20; i++) { if(rates[i].high > high20) high20 = rates[i].high; if(rates[i].low < low20) low20 = rates[i].low; }
      exit10 = rates[1].low;
      for(int i = 1; i <= 10; i++) { if(rates[i].low < exit10) exit10 = rates[i].low; }
   }

   double current_price = SymbolInfoDouble(_Symbol, SYMBOL_BID);

   string bias = "NEUTRAL";
   int score = 4;
   if(current_price >= high20) { bias = "LONG"; score = 8; }
   else if(current_price <= low20) { bias = "SHORT"; score = 8; }

   // Đọc mũi tên từ indicator (buffer 6 = S1LongArrow, 7 = S1ShortArrow)
   double buf_long[], buf_short[];
   ArraySetAsSeries(buf_long, true);
   ArraySetAsSeries(buf_short, true);
   int cl = CopyBuffer(g_indicator_handle, 6, 0, 5, buf_long);
   int cs = CopyBuffer(g_indicator_handle, 7, 0, 5, buf_short);

   if(cl >= 2 && buf_long[1] != EMPTY_VALUE && buf_long[1] != 0) { bias = "LONG"; score = 8; }
   if(cs >= 2 && buf_short[1] != EMPTY_VALUE && buf_short[1] != 0) { bias = "SHORT"; score = 8; }

   // Volatility = ATR Wilder (iATR); fallback = TR trung bình cộng 20 nến
   double volatility = 0;
   double abuf[];
   ArraySetAsSeries(abuf, true);
   if(g_atr_handle != INVALID_HANDLE && CopyBuffer(g_atr_handle, 0, 0, 1, abuf) >= 1 && abuf[0] != EMPTY_VALUE)
      volatility = abuf[0];
   else
   {
      MqlRates rates[];
      ArraySetAsSeries(rates, true);
      double tr_sum = 0;
      if(CopyRates(_Symbol, PERIOD_M5, 0, 30, rates) >= 25)
      {
         for(int i = 1; i <= 20; i++)
         {
            double hl = rates[i].high - rates[i].low;
            double hc = MathAbs(rates[i].high - rates[i+1].close);
            double lc = MathAbs(rates[i].low  - rates[i+1].close);
            tr_sum += MathMax(hl, MathMax(hc, lc));
         }
      }
      volatility = tr_sum / 20.0;
   }
   double atr_val = volatility;

   double gain = current_price - high20;

   // RSI Wilder (iRSI); fallback 50 nếu không có dữ liệu
   double rsi_val = 50.0;
   double rbuf[];
   ArraySetAsSeries(rbuf, true);
   if(g_rsi_handle != INVALID_HANDLE && CopyBuffer(g_rsi_handle, 0, 0, 1, rbuf) >= 1 && rbuf[0] != EMPTY_VALUE)
      rsi_val = rbuf[0];

   // ADX thật (iADX); fallback 0 nếu không có dữ liệu
   double adx_val = 0;
   double adxb[];
   ArraySetAsSeries(adxb, true);
   if(g_adx_handle != INVALID_HANDLE && CopyBuffer(g_adx_handle, 0, 0, 1, adxb) >= 1 && adxb[0] != EMPTY_VALUE)
      adx_val = adxb[0];

   // EMA Gap (chạy xuôi chiều)
   double ema9 = 0, ema21 = 0;
   double close_arr[];
   ArraySetAsSeries(close_arr, true);
   if(CopyClose(_Symbol, PERIOD_CURRENT, 0, 30, close_arr) >= 30)
      ComputeEMA(close_arr, 30, ema9, ema21);
   double emaGap = (ema9 > 0 && ema21 > 0) ? (ema9 - ema21) : 4.50;

   // VWAP thật (tích luỹ vol*typical/vol) theo phiên ngày -> độ lệch so với giá hiện tại
   double vwap_delta = 0;
   {
      double vwap_level = ComputeVWAP();
      if(vwap_level > 0) vwap_delta = current_price - vwap_level;
   }

   double spread_val = SymbolInfoInteger(_Symbol, SYMBOL_SPREAD) * _Point;
   if(spread_val <= 0) spread_val = 1.2;

   // Multi-TF data
   string m15b = "NEUTRAL", m30b = "NEUTRAL", h1b = "NEUTRAL";
   int m15s = 4, m30s = 4, h1s = 4;
   double m15h = 0, m15l = 0, m15e = 0, m30h = 0, m30l = 0, m30e = 0, h1h = 0, h1l = 0, h1e = 0;

   MqlRates r15[], r30[], r1[];
   ArraySetAsSeries(r15, true); ArraySetAsSeries(r30, true); ArraySetAsSeries(r1, true);
   if(CopyRates(_Symbol, PERIOD_M15, 0, 25, r15) >= 25)
   {
      double h = r15[1].high, l = r15[1].low, e = r15[1].low;
      for(int i = 1; i <= 20; i++) { if(r15[i].high > h) h = r15[i].high; if(r15[i].low < l) l = r15[i].low; }
      for(int i = 1; i <= 10; i++) { if(r15[i].low < e) e = r15[i].low; }
      m15h = h; m15l = l; m15e = e;
      if(current_price >= h) { m15b = "LONG"; m15s = 8; } else if(current_price <= l) { m15b = "SHORT"; m15s = 8; }
   }
   if(CopyRates(_Symbol, PERIOD_M30, 0, 25, r30) >= 25)
   {
      double h = r30[1].high, l = r30[1].low, e = r30[1].low;
      for(int i = 1; i <= 20; i++) { if(r30[i].high > h) h = r30[i].high; if(r30[i].low < l) l = r30[i].low; }
      for(int i = 1; i <= 10; i++) { if(r30[i].low < e) e = r30[i].low; }
      m30h = h; m30l = l; m30e = e;
      if(current_price >= h) { m30b = "LONG"; m30s = 7; } else if(current_price <= l) { m30b = "SHORT"; m30s = 7; }
   }
   if(CopyRates(_Symbol, PERIOD_H1, 0, 25, r1) >= 25)
   {
      double h = r1[1].high, l = r1[1].low, e = r1[1].low;
      for(int i = 1; i <= 20; i++) { if(r1[i].high > h) h = r1[i].high; if(r1[i].low < l) l = r1[i].low; }
      for(int i = 1; i <= 10; i++) { if(r1[i].low < e) e = r1[i].low; }
      h1h = h; h1l = l; h1e = e;
      if(current_price >= h) { h1b = "LONG"; h1s = 9; } else if(current_price <= l) { h1b = "SHORT"; h1s = 9; }
   }

   string htfLabel = "Not Against";
   if(bias == "NEUTRAL") htfLabel = "Pass";

   string json = StringFormat(
      "{\"symbol\":\"%s\",\"time\":\"%s\",\"price\":%.2f,\"bias\":\"%s\",\"score\":%d,"
      "\"volatility\":%.2f,\"entry\":{\"high\":%.2f,\"low\":%.2f,\"gain\":%.2f},\"exit\":%.2f,\"htf\":\"%s\","
      "\"multiTf\":{"
         "\"m15\":{\"bias\":\"%s\",\"score\":%d,\"high\":%.2f,\"low\":%.2f,\"exit\":%.2f,\"htf\":\"%s\"},"
         "\"m30\":{\"bias\":\"%s\",\"score\":%d,\"high\":%.2f,\"low\":%.2f,\"exit\":%.2f,\"htf\":\"%s\"},"
         "\"h1\":{\"bias\":\"%s\",\"score\":%d,\"high\":%.2f,\"low\":%.2f,\"exit\":%.2f,\"htf\":\"%s\"}"
      "},"
      "\"indicators\":{\"rsi\":%.1f,\"atr\":%.2f,\"emaGap\":%.2f,\"adx\":%.1f,\"vwap\":%.2f,\"spread\":%.2f}}",
      _Symbol, TimeToString(TimeCurrent(), TIME_SECONDS), current_price, bias, score,
      volatility, high20, low20, gain, exit10, htfLabel,
      m15b, m15s, m15h, m15l, m15e, (m15b=="NEUTRAL"?"Pass":(m15b=="LONG"?"Bullish":"Bearish")),
      m30b, m30s, m30h, m30l, m30e, (m30b=="NEUTRAL"?"Pass":(m30b=="LONG"?"Bullish":"Bearish")),
      h1b, h1s, h1h, h1l, h1e, (h1b=="NEUTRAL"?"Pass":(h1b=="LONG"?"Bullish":"Bearish")),
      rsi_val, atr_val, emaGap, adx_val, vwap_delta, spread_val
   );

   char post[], result[];
   string headers = "Content-Type: application/json\r\nUser-Agent: TNVWebEA/1.10\r\nAuthorization: Bearer " + InpSecretToken + "\r\n";
   int len = StringLen(json);
   StringToCharArray(json, post, 0, len, CP_UTF8);
   string result_headers;
   ResetLastError();
   int res = WebRequest("POST", InpWebUrl, headers, 5000, post, result, result_headers);
   if(res == 200 || res == 201)
      PrintFormat("[TNV EA] Sent %s %.2f -> web (HTTP %d)", bias, current_price, res);
   else
      PrintFormat("[TNV EA] HTTP %d - check URL or WebRequest settings", res);
}
//+------------------------------------------------------------------+
