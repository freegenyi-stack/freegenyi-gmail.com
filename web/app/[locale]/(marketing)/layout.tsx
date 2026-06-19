import Footer from "@/components/Footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="fg-landing-shell fg-landing-fonts fg-padora-cream relative z-10 flex min-h-full flex-1 flex-col">
      {children}
      <Footer />
    </div>
  );
}
