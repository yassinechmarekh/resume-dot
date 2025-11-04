
import Container from "../container";
import { Button } from "../ui/button";
import Logo from "../logo";

const DashboardNavbar = () => {
  return (
    <nav className={"bg-white border-b border-gray-300 py-2 shadow-sm shadow-gray-300"}>
      <Container className={"flex items-center justify-between"}>
        <Logo />
        <div className={"flex items-center gap-2"}>
          <span className={'text-xs xs:text-sm'}>Hi, {"Yassine"}</span>
          <Button variant={"secondary"} size={"sm"} className={"rounded-2xl px-6"}>
            Logout
          </Button>
        </div>
      </Container>
    </nav>
  );
};

export default DashboardNavbar;
