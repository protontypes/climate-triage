import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className=" flex min-h-screen flex-col items-center  justify-center space-y-10 bg-black-400 text-center text-silver-500 antialiased">
      <h3 className="text-3xl font-bold text-primary lg:text-5xl">404 😅</h3>

      <h3 className="text-xl lg:text-3xl">Whooops! You are in the wrong place.</h3>
      <p className="text-silver-500">the page you are looking for does not exist</p>
      <Link
        title="Go back"
        aria-label="Go back"
        href="/"
        className="flex w-1/2 items-center justify-center rounded-md border border-primary py-3 text-center  font-bold uppercase transition-all hover:border-primary hover:text-primary md:w-1/4 lg:w-1/5"
      >
        <FontAwesomeIcon icon={faHome} className="mx-2" />
        Go back
      </Link>
    </div>
  );
}
