import { AppModal, ShowModalButton } from "../components/AppModal";

export default function ModalTest() {
  const Header = () => <div className="text-3xl">header</div>;

  return (
    <>
      <ShowModalButton className="btn-primary btn">open</ShowModalButton>
      <AppModal header={<Header />} content={"content"} footer={"foooter"}>
        <div className="">hahaah</div>
      </AppModal>
    </>
  );
}
