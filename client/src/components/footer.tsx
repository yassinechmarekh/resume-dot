import Link from "next/link";
import Container from "./container";
import Logo from "./logo";
import { menuLinks } from "@/lib/constants";

const Footer = () => {
  return (
    <footer
      className={
        "border-t border-gray-200 mt-10 bg-linear-to-b from-green-50 to-green-100"
      }
    >
      <Container>
        <div className="flex flex-col md:flex-row justify-between border-b border-gray-300 gap-10 py-6">
          <div className="md:max-w-96">
            <Logo />
            <p className="mt-6 text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
          <div className="flex-1 flex items-start md:justify-end gap-20">
            <div>
              <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
              <ul className="text-sm space-y-2">
                {menuLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className={"hover:text-green-700 capitalize hover-effect"}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-semibold mb-5 text-gray-800">Get in touch</h2>
              <div className="text-sm space-y-2">
                <p>+1-212-456-7890</p>
                <p>contact@example.com</p>
              </div>
            </div>
          </div>
        </div>
        <p className="pt-4 text-center text-xs md:text-sm pb-5">
          Copyright {new Date().getFullYear()} ©{" "}
          <Link href={"/"} className="hover:underline">
            Resume
          </Link>
          . All Right Reserved.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
