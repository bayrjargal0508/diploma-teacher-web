type SmallNavProps = {
  itemSelected: number;
  info: Array<string>;
  setItemSelected: (index: number) => void;
};

export default function SmallNav({
  itemSelected,
  info,
  setItemSelected,
}: SmallNavProps) {
  return (
    <div className="my-[20px] flex   border-b-[0.6px] border-[#D9D9DF] dark:border-[#3e4246] lg:justify-normal">
      {info.map((item, i) => (
        <div
          key={i}
          className={`flex cursor-pointer px-4 py-2  font-semibold text-[16px] md:px-8 lg:px-[47px] ${
            itemSelected === i
              ? "border-b-[1.4px] border-primary_primary text-[#FE9A05]"
              : "text-label_tertiary"
          }`}
          onClick={() => setItemSelected(i)}
        >
          {item}
        </div>
      ))}
    </div>
  );
}
