"use client";

import { Shield } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export function SiteFooter() {
  const { language, t } = useLanguage();

  return (
    <footer
      id="footer"
      className="mt-10 pt-6 border-t border-white/10 text-[0.74rem] text-gray-400 leading-relaxed font-sans"
    >
      <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 mb-5">
        <Shield className="w-4 h-4 text-[#f5c542] shrink-0 mt-0.5" />
        <div className="space-y-1 text-[0.72rem] text-gray-400">
          <p className="text-gray-300 font-semibold m-0">
            {language === "vi" ? "Công bố Pháp lý & Quản lý Rủi ro" : "Regulatory & Risk Disclosure"}
          </p>
          <p className="m-0">
            {t.footerDesc}{" "}
            {language === "vi"
              ? "Chúng tôi không cung cấp dịch vụ tư vấn tài chính, ủy thác hay quản lý tài khoản. Mọi quyết định giao dịch đều do người dùng tự chịu trách nhiệm."
              : "We do not provide financial advice, personalized trading signals, managed accounts, or direct trade execution. All trading decisions are made solely by the user."}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-5 text-[0.72rem] text-gray-500">
        <div>
          {t.footerRights}
        </div>

        <div className="flex items-center gap-3 font-medium">
          <a
            href="#terms"
            onClick={(e) => {
              e.preventDefault();
              alert(
                language === "vi"
                  ? "Điều khoản Dịch vụ TNV:\n1. Phục vụ mục đích phân tích & giáo dục.\n2. Người dùng tự quản lý rủi ro vốn."
                  : "TNV Terms of Service:\n1. Educational use only.\n2. Risk responsibility lies with user."
              );
            }}
            className="text-[#f5c542] hover:underline"
          >
            {language === "vi" ? "Điều khoản" : "Terms"}
          </a>
          <span>&bull;</span>
          <a
            href="#privacy"
            onClick={(e) => {
              e.preventDefault();
              alert(
                language === "vi"
                  ? "Chính sách Bảo mật TNV:\nTuyệt đối không chia sẻ thông tin cá nhân hoặc API key của người dùng cho bên thứ ba."
                  : "TNV Privacy Policy:\nNo user API keys or personal data are shared with third parties."
              );
            }}
            className="text-[#f5c542] hover:underline"
          >
            {language === "vi" ? "Bảo mật" : "Privacy"}
          </a>
          <span>&bull;</span>
          <a
            href="#refund"
            onClick={(e) => {
              e.preventDefault();
              alert(
                language === "vi"
                  ? "Chính sách Hoàn tiền TNV:\nCam kết hỗ trợ tối đa cho các gói tài khoản PRO."
                  : "TNV Refund Policy:\nSatisfaction guarantee on PRO subscriptions."
              );
            }}
            className="text-[#f5c542] hover:underline"
          >
            {language === "vi" ? "Chính sách Hoàn tiền" : "Refund Policy"}
          </a>
        </div>
      </div>
    </footer>
  );
}
