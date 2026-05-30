import AnimationDiv from "@/modules/global/animations/animate_div";
import Button from "@/modules/global/elements/button";
import ImageBox from "@/modules/global/elements/image_box";
import Section from "@/modules/global/elements/section";
import SvgIcon from "@/modules/global/icons/svg_icons";
import Input from "@/modules/global/input/input";
import TextArea from "@/modules/global/input/textarea";

import { useState } from "react";

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return (
    <Section fullWidth className="space-y-10 -mt-20">
      <Section
        fullWidth
        className="relative overflow-hidden rounded-b-[25px] sm:rounded-b-[50px] lg:rounded-b-[100px] bg-linear-to-r from-fuchsia-600 to-violet-600 pt-30 lg:pt-50 pb-10 md:pb-40 px-6 md:px-10 shadow-2xl space-y-6">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <AnimationDiv className="text-center text-white text-3xl xs:text-4xl md:text-5xl font-bold">Need Help? We’re Here for You</AnimationDiv>
        </div>
        <AnimationDiv delay="delay-500" className="text-center mx-auto max-w-xl text-gray-200">
          Helping freelancers, startups, and agencies grow without software limitations.
        </AnimationDiv>
      </Section>

      <Section className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-1 py-10 md:py-20 px-6">
        <div className="p-8 bg-violet-50 rounded space-y-8">
          <AnimationDiv className="text-3xl font-semibold text-black">Contact Informatlon</AnimationDiv>
          <hr className="border-gray-200" />
          <AnimationDiv>
            <div className="flex items-center gap-4">
              <div>
                <SvgIcon name="location_on" className="size-9 p-2 rounded-full bg-violet-500 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Our Address</h3>
                <p className="text-gray-500">2464 Royal Ln. Mesa, New Jersey 45463.</p>
              </div>
            </div>
          </AnimationDiv>
          <AnimationDiv delay="delay-500">
            <div className="flex items-center gap-4">
              <div>
                <SvgIcon name="call" className="size-9 p-2 rounded-full bg-violet-500 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Contact Namber</h3>
                <p className="text-gray-500">+6246 1598596969 , 035 6666 3951</p>
              </div>
            </div>
          </AnimationDiv>
          <AnimationDiv delay="delay-1000">
            <div className="flex items-center gap-4">
              <div>
                <SvgIcon name="mail" className="size-9 p-2 rounded-full bg-violet-500 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Email Us</h3>
                <p className="text-gray-500">info@exmple.com</p>
              </div>
            </div>
          </AnimationDiv>
        </div>
        <div className="p-8 bg-fuchsia-50 rounded space-y-8">
          <h1 className="text-3xl font-semibold text-black">Ready to Get Started?</h1>
          <hr className="border-gray-200" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Input label="Your Name" iconName="person" value={name} setValue={setName} id="name" placeholder="Jhon Doe" required />
            <Input label="Email Address" iconName="mail" value={email} setValue={setEmail} id="email" placeholder="info@emaple.com" required />
          </div>
          <TextArea label="Message" value={message} setValue={setMessage} id="message" placeholder="Your Message Here...." required />
          <AnimationDiv delay="delay-1500">
            <Button showIcon>Submit</Button>
          </AnimationDiv>
        </div>
      </Section>

      <Section fullWidth className="py-10 px-6">
        <Section>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2818.4981910297074!2d7.7195421122101475!3d45.0554040709495!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478872c186267ec3%3A0xdb1f5f5559a4d48b!2sStrada%20Val%20S.%20Martino%2C%20111%2C%2010131%20Torino%20TO%2C%20Italy!5e0!3m2!1sen!2sbd!4v1767605431359!5m2!1sen!2sbd"
            width="100%"
            height="450"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="bg-linear-to-r from-fuchsia-500 to-violet-500 p-2 rounded-3xl"></iframe>
        </Section>
      </Section>

      <Section fullWidth className="py-10 lg:py-30 px-6">
        <Section className="space-y-8">
          <div className="flex justify-center">
            <AnimationDiv className="px-4 py-1.5 bg-violet-800/5 text-black border border-gray-200 font-semibold rounded-full">How does it work?</AnimationDiv>
          </div>
          <AnimationDiv className="text-center font-black text-2xl xs:text-3xl md:text-4xl lg:text-6xl text-black">Get Started in 3 Simple Steps</AnimationDiv>
          <AnimationDiv delay="delay-500" className="text-center text-gray-500">
            From subscription to access, we've made it incredibly easy
          </AnimationDiv>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimationDiv>
              <div className="p-8 rounded-3xl bg-white space-y-8 border-4 border-violet-500/10 shadow hover:shadow-lg">
                <div className="flex">
                  <div className="p-4 bg-linear-to-r from-fuchsia-500 to-violet-500 text-white rounded-2xl text-7xl font-bold">01</div>
                </div>
                <div>
                  <h1 className="text-xl xs:text-3xl font-semibold text-black">Take your subscription</h1>
                  <p className="text-gray-500">Choose between the Monthly or Annual plan</p>
                </div>

                <Button url="/pricing" showIcon>
                  View Pricing Plans
                </Button>
              </div>
            </AnimationDiv>
            <AnimationDiv delay="delay-800">
              <div className="p-8 rounded-3xl bg-white space-y-8 border-4 border-violet-500/10 shadow hover:shadow-lg">
                <div className="flex">
                  <div className="p-4 bg-linear-to-r from-fuchsia-500 to-violet-500 text-white rounded-2xl text-7xl font-bold">02</div>
                </div>
                <div>
                  <h1 className="text-xl xs:text-3xl font-semibold text-black">Install xToolVip App</h1>
                  <p className="text-gray-500">Install XToolVip software on your Windows.</p>
                </div>

                <Button url="/register" showIcon>
                  Get Start Now
                </Button>
              </div>
            </AnimationDiv>
            <AnimationDiv delay="delay-1200">
              <div className="p-8 rounded-3xl bg-white space-y-8 border-4 border-violet-500/10 shadow hover:shadow-lg">
                <div className="flex">
                  <div className="p-4 bg-linear-to-r from-fuchsia-500 to-violet-500 text-white rounded-2xl text-7xl font-bold">03</div>
                </div>
                <div>
                  <h1 className="text-xl xs:text-3xl font-semibold text-black">Get Instant Access</h1>
                  <p className="text-gray-500">Start using all the tools!</p>
                </div>

                <Button url="/tools" showIcon>
                  Discover More
                </Button>
              </div>
            </AnimationDiv>
          </div>
        </Section>
      </Section>

      <Section fullWidth className="-mb-25 relative z-5 md:pt-30">
        <Section className="bg-linear-to-r from-fuchsia-500 to-violet-500 py-10 md:py-20 px-6 md:px-20 rounded-2xl space-y-8 shadow-2xl grid grid-cols-2 gap-6">
          <AnimationDiv duration="duration-4000" className="hidden lg:flex items-center">
            <ImageBox
              src="/images/img2.jpg"
              source_type="frontend"
              alt="cta"
              className="h-60 lg:h-70 xl:h-100 rounded-lg opacity-50"
              image_className="w-full h-full object-cover"
            />
          </AnimationDiv>
          <div className="flex items-center col-span-2 lg:col-span-1">
            <div className="space-y-6">
              <AnimationDiv className="text-2xl lg:text-5xl font-semibold text-white">Ready to Access All These Tools?</AnimationDiv>
              <AnimationDiv delay="delay-1000" className="text-gray-300">
                Join thousands of successful e-commerce entrepreneurs who are already saving time and money with xToolVip.
              </AnimationDiv>
              <AnimationDiv delay="delay-1500">
                <Button url="/register" showIcon className="bg-white hover:bg-violet-600 hover:text-white">
                  Get Access Now
                </Button>
              </AnimationDiv>
            </div>
          </div>
        </Section>
      </Section>
    </Section>
  );
}

export default ContactPage;
