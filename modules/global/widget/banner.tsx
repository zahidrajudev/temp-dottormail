import Section from "@/modules/global/elements/section";

interface Props {
  children?: React.ReactNode;
  pt?: string;
  pb?: string;
  rounded?: string;
}
function Banner({ children, pb = "pb-40 lg:pb-80", pt = "pt-30 lg:pt-40", rounded = "rounded-b-[25px] sm:rounded-b-[50px] lg:rounded-b-[100px]" }: Props) {
  return (
    <Section fullWidth className="-mt-20">
      <Section fullWidth className={`relative overflow-hidden bg-violet-900/69 px-10 shadow-2xl ${pb} ${pt} ${rounded}`}>
        <div className="absolute inset-0 bg-linear-to-l from-fuchsia-600 to-violet-600 blur-3xl z-1" />
        <div className="relative z-2 w-full space-y-8">{children}</div>
      </Section>
    </Section>
  );
}

export default Banner;
