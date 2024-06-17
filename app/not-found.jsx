import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-slate-600">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-600 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-slate-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-600 sm:text-3xl">
            Go Back
          </h3>
        </div>
      </main>
    </>
  );
}
