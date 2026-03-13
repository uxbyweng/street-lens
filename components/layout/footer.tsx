import { TextLink } from "@/components/ui/text-link";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandInstagram,
} from "@tabler/icons-react";

export default function Footer() {
  return (
    <footer className="border-t bg-mauve-100">
      <div className="flex items-center justify-evenly whitespace-nowrap p-2 text-xs">
        <span>
          © {new Date().getFullYear()}{" "}
          <TextLink href="https://weng.eu/" target="_blank">
            WENG.EU
          </TextLink>
        </span>
        <TextLink href="/imprint">Imprint</TextLink>
        <TextLink
          href="https://github.com/uxbyweng/street-lens"
          target="_blank"
        >
          <IconBrandGithub size={18} stroke={1.8} />
        </TextLink>
        <TextLink href="https://www.linkedin.com/in/kweng/" target="_blank">
          <IconBrandLinkedin size={18} stroke={1.8} />
        </TextLink>
        <TextLink
          href="https://www.instagram.com/blnstreetview/"
          target="_blank"
        >
          <IconBrandInstagram size={18} stroke={1.8} />
        </TextLink>
      </div>
    </footer>
  );
}
