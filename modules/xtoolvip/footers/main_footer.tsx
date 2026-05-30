import Section from "@/modules/global/elements/section";
import ImageBox from "@/modules/global/elements/image_box";
import { dateTimeFormat } from "@/lib/helper";
import { useGlobalStore } from "@/modules/global/store/useGlobalStore";
import SvgIcon from "@/modules/global/icons/svg_icons";
import AnimationDiv from "@/modules/global/animations/animate_div";

const MainFooter = () => {
  const { logo_url, logo_light_url } = useGlobalStore();
  return (
    <Section fullWidth={true} className="relative overflow-hidden bg-violet-950 pt-40 pb-8 space-y-8">
      <div className="absolute inset-0 bg-linear-to-l from-fuchsia-900/80 to-violet-900/60 blur-3xl z-1" />

      <Section outerClassName="relative z-2 px-4 pb-10">
        <div className="flex justify-center">
          <div className=" text-[16px] xs:text-[25px] sm:text-[36px] lg:text-[48px] font-bold text-white space-y-6">
            <AnimationDiv className="text-center">One subscription. Multiple premium tools.</AnimationDiv>
          </div>
        </div>
        <AnimationDiv delay="delay-500" className="text-center text-gray-200">
          Smart access to premium digital tools through a single affordable subscription. Built for startups, freelancers, marketers, and agencies who want more value for less.
        </AnimationDiv>
      </Section>
      <hr />
      <Section outerClassName="relative z-2 px-4">
        <div className="grid grid-cols-1 lg:flex sm:justify-around gap-10 my-10 lg:my-30">
          <AnimationDiv>
            <div className="space-y-6 text-gray-200">
              <div className="flex justify-center lg:justify-start items-center gap-4 text-gray-200">
                <ImageBox src={logo_light_url} className=" h-16" alt="" />
              </div>

              <p className="text-gray-200 lg:max-w-sm text-center lg:text-start">
                XToolVIP is an independent platform and is not affiliated with, endorsed by, or sponsored by any third-party software providers.
              </p>
              <div className="flex gap-2 text-violet-200 justify-center lg:justify-start">
                <div>Facebook</div>
                <div>Facebook</div>
                <div>Facebook</div>
                <div>Facebook</div>
              </div>
            </div>
          </AnimationDiv>
          <AnimationDiv delay="delay-500">
            <div className="text-gray-200 space-y-4">
              <h1 className="text-xl font-bold text-center lg:text-start">Quick Links</h1>

              <ul className="space-y-3 text-gray-300">
                <li className="text-center lg:text-start">About</li>
                <li className="text-center lg:text-start">Tools</li>
                <li className="text-center lg:text-start">Pricing</li>
                <li className="text-center lg:text-start">Contact</li>
              </ul>
            </div>
          </AnimationDiv>
          <AnimationDiv delay="delay-1000">
            <div className="text-gray-200 space-y-4">
              <h1 className="text-xl font-bold text-center lg:text-start">Ready to Get Started?</h1>

              <div className="flex gap-4 justify-center lg:justify-start">
                <div>
                  <SvgIcon name="mail" />
                </div>
                <div className="text-gray-300">
                  support@xtoolvip.com <br /> info@xtoolvip.com
                </div>
              </div>
              <div className="flex gap-4  justify-center lg:justify-start">
                <div>
                  <SvgIcon name="call" />
                </div>
                <div className="text-gray-300">
                  +8801624246959 <br /> +001 1234 678 90
                </div>
              </div>
            </div>
          </AnimationDiv>
        </div>
      </Section>
      <hr />
      <Section outerClassName="relative z-2 px-4">
        <div className="md:flex justify-between space-y-4 md:space-y-0 text-center md:text-start">
          <div className="text-[12px] xs:text-[16px] text-gray-200">©️ {dateTimeFormat(new Date(), "year")} Xtoolvip LLC . All rights reserved.</div>
          <div className="text-[12px] xs:text-[16px] text-gray-200">Developed By www.macrohard.it</div>
        </div>
      </Section>
    </Section>
  );
};

export default MainFooter;
