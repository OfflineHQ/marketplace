// import Image from "next/image";
// import NotFound from "../public/not-found.png";

export default function NotFound() {
  return (
    <section className="container">
      {/* TODO add traduction and 404 image + button to come back to last route */}
      {/* <Image src={NotFound} alt='Not found error graphic' /> */}
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
    </section>
  );
}
