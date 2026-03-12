import { TextLink } from "@/components/ui/text-link";

export default function Footer() {
  return (
    <footer>
      <div className="flex">
        <TextLink href="/" aria-label="Go to homepage">
          <span>STREET LENS</span>
        </TextLink>

        <div className="flex">
          <span>© 2006 WENG.EU</span>

          <TextLink
            href="https://github.com/uxbyweng/street-lens"
            target="_blank"
            rel="noreferrer"
          >
            GitHub Code @uxbyweng
          </TextLink>

          <TextLink href="/impressum">Impressum</TextLink>
        </div>
      </div>
    </footer>
  );
}
