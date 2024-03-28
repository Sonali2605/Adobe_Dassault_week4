const DashboardHeading = () => {
  return ( <div>
    <div className="grid grid-rows-1 grid-flow-col gap-4">
      <div className="row-start-1 row-span-2 mt-10 px-20 mx-20">
      <div className="text-6xl font-semibold mb-4">Prepare to Grow Wings!</div>

        <p>Welcome to the Premier Protect Academy, your one-stop destination to acquire knowledge about products, compliances, deals, commissions and rewards. Learn-on-the-go, interact with your peers and stay abreast of the latest news!</p>
      </div>
      <div className="row-start-1 row-end-2 col-span-2 pr-20 mr-10">
        <img className="mb-2 h-80 w-80 animate-fade-in_5s_ease-in-out" src="/images/Dashboard/banner-image1.png" alt="bannerImg" />
      </div>
    </div>
  </div>
  )
}

export default DashboardHeading