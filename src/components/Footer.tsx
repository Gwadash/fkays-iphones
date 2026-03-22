import { MessageCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleWhatsAppClick = () => {
    window.open("https://wa.me/27717273856", "_blank");
  };

  return (
    <footer className="bg-brand-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">
              FKAY<span className="text-brand-orange">PLUG</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Your trusted source for quality iPhones. If you can't beat us, join us!
            </p>
            <Button 
              onClick={handleWhatsAppClick}
              className="bg-gradient-primary hover:shadow-hover"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with us
            </Button>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-brand-orange">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-orange" />
                <span>0717273856</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-brand-orange" />
                <span>0602270998</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-brand-orange" />
                <span>WhatsApp Available</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4 text-brand-orange">Services</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Brand New iPhones</li>
              <li>Pre-owned iPhones</li>
              <li>Nationwide Delivery</li>
              <li>Cash on Delivery</li>
              <li>Quality Guarantee</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 whitespace-pre-wrap">
            © {currentYear} FkayPlug. All rights reserved. Built for quality iPhone sales.{"\n\n"}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;