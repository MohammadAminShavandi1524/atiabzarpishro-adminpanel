interface SideBarItemHeaderProps {
  label: string;
}

const SideBarItemHeader = ({ label }: SideBarItemHeaderProps) => {
  return (
    <div className="mb-1 px-3.5 pt-1 xl:px-3 2xl:px-3.5">
      <span className="text-muted-foreground/70 3xl:text-[14px] 3xl:tracking-[0.12em] text-[14px] font-semibold tracking-[0.12em] uppercase xl:text-[12px] xl:tracking-[0.1em] 2xl:text-[13px]">
        {label}
      </span>
    </div>
  );
};

export default SideBarItemHeader;
