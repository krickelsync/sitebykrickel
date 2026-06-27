import BeforeAfterSlider from "@/components/products/BeforeAfterSlider";

interface Props {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
}

const BeforeAfterBlock = ({ beforeImage, afterImage, beforeLabel, afterLabel, title }: Props) => (
  <div className="max-w-2xl mx-auto">
    {title && <h3 className="font-display text-2xl md:text-4xl font-extrabold uppercase text-center mb-8">{title}</h3>}
    <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} beforeLabel={beforeLabel} afterLabel={afterLabel} />
  </div>
);

export default BeforeAfterBlock;