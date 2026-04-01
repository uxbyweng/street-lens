import type { Metadata } from "next";
import { PageIntro } from "@/components/layout/page-intro";

export const metadata: Metadata = {
  title: "Imprint",
  description: "Legal notice for BERLIN STREET VIEW",
};

export default function ImprintPage() {
  return (
    <>
      <PageIntro
        title="Imprint"
        subtitle="Mandatory legal notice"
        bgImage="/images/stage_impressum.jpg"
        className="font-fjalla rounded-none h-50 lg:h-80 sm:px-5 md:px-10 lg:px-40 lg:py-15 text-black"
      />

      <section className="mx-auto my-20 max-w-6xl px-4">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-6 text-base leading-6">
              <section>
                <h2 className="text-xl font-semibold">1. Service Provider</h2>
                <p className="mt-2">
                  Karsten Weng
                  <br />
                  10999 Berlin
                  <br />
                  Germany
                  <br />
                  <a
                    href="mailto:info@weng.eu"
                    className="underline underline-offset-2"
                  >
                    info@weng.eu
                  </a>
                  <br />
                  VAT ID: DE418166191
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">
                  2. Editorially Responsible
                </h2>
                <p className="mt-2">
                  Karsten Weng
                  <br />
                  10999 Berlin
                  <br />
                  Germany
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">
                  3. Dispute Resolution / ODR
                </h2>
                <p className="mt-2">
                  The European Commission provides a platform for Online Dispute
                  Resolution (ODR):{" "}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2"
                  >
                    ec.europa.eu/consumers/odr
                  </a>
                  .
                </p>
                <p className="mt-2">
                  We are neither obliged nor willing to participate in dispute
                  resolution proceedings before a consumer arbitration board.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">
                  4. Liability for Contents
                </h2>
                <p className="mt-2">
                  As a service provider, we are responsible for our own content
                  on these pages in accordance with general laws. However, we
                  are not obliged to monitor transmitted or stored third-party
                  information or to investigate circumstances indicating illegal
                  activity. Obligations to remove or block the use of
                  information under general laws remain unaffected. Liability in
                  this respect is only possible from the time we become aware of
                  a specific infringement. Upon becoming aware of such legal
                  violations, we will remove the content immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">
                  5. Liability for Links
                </h2>
                <p className="mt-2">
                  Our website contains links to external third-party websites
                  whose content we cannot influence. Therefore, we cannot assume
                  any liability for such external content. The respective
                  provider or operator of the linked pages is always responsible
                  for their content. Illegal content was not identifiable at the
                  time of linking. Permanent monitoring of linked pages is not
                  reasonable without concrete evidence of a violation. If we
                  become aware of any infringements, we will remove such links
                  immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">6. Copyright</h2>
                <p className="mt-2">
                  The content and works created by the site operator on these
                  pages are subject to German copyright law. Reproduction,
                  editing, distribution, or any kind of exploitation outside the
                  limits of copyright law require the prior written consent of
                  the respective author or creator. Downloads and copies of this
                  site are only permitted for private, non-commercial use. Where
                  content on this site was not created by the operator,
                  third-party copyrights are respected and such content is
                  marked accordingly.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold">
                  7. Hosting and Data Storage
                </h2>
                <p className="mt-2">
                  This website is hosted by Vercel. Project-related data is
                  stored in a MongoDB database. Where required, data processing
                  is carried out on the basis of applicable data processing
                  agreements pursuant to Art. 28 GDPR.
                </p>
              </section>

              <section>
                <h2 className="text-base font-semibold">Last updated</h2>
                <p className="mt-2">March 13, 2026</p>
              </section>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-2xl border bg-muted/30 p-5 text-sm leading-6">
              <h2 className="text-xl font-semibold">Contact</h2>
              <p className="mt-3">
                Karsten Weng
                <br />
                10999 Berlin
                <br />
                Germany
              </p>
              <p className="mt-3">
                <a
                  href="mailto:info@weng.eu"
                  className="underline underline-offset-2"
                >
                  info@weng.eu
                </a>
              </p>
              <p className="mt-3">VAT ID: DE418166191</p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
