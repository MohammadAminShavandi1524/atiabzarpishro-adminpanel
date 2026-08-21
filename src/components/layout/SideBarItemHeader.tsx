interface SideBarItemHeaderProps {
  label: string;
}

const SideBarItemHeader = ({ label }: SideBarItemHeaderProps) => {
  return (
    <div className="mb-1 px-3.5 pt-1">
      <span className="text-muted-foreground/70 text-[14px] font-semibold tracking-[0.12em] uppercase">
        {label}
      </span>
    </div>
  );
};

export default SideBarItemHeader;
