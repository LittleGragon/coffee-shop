import { Logo } from './logo';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-[#FDFBF6] border-t">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Logo withLink={true} />
            <p className="text-sm text-[#4A2C2A]/80">
              Experience the finest coffee and handcrafted cakes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-[#4A2C2A] mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm text-[#4A2C2A]/80">
              <li>123 Coffee Lane, Brewville, CA 90210</li>
              <li>Email: contact@coffeebliss.com</li>
              <li>Phone: (555) 123-4567</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-[#4A2C2A] mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-[#4A2C2A]/80 hover:text-[#A3B18A] transition-colors"
                >
                  <social.icon className="h-6 w-6" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-[#4A2C2A]/60">
          &copy; {new Date().getFullYear()} Coffee Bliss. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}