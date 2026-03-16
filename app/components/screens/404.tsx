function Page404() {
  return (
    <div className="hero min-h-screen w-full bg-white flex flex-col align-middle justify-center">
      <div className="text-center hero-content text-3xl font-bold">
        <div>
          <h1 className="font-bold text-black">
            The page is not found.
          </h1>
          <br />
          <div className="mt-4">
            <a href="/" className="link-primary ">Go Home</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page404
