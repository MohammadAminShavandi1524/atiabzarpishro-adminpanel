interface SideBarItemHeaderProps {
  label: string;
}

const SideBarItemHeader = ({ label }: SideBarItemHeaderProps) => {
  return (
    <div className="mb-1 px-3.5 pt-1 xl:px-3 2xl:px-3.5">
      <span className="text-muted-foreground/70 3xl:text-[14px]  text-[14px] font-semibold  uppercase xl:text-[12px]  2xl:text-[13px]">
        {label}
      </span>
    </div>
  );
};

export default SideBarItemHeader;
