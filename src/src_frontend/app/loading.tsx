export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <>
      <div className="fixed inset-0 flex flex-col gap-10 items-center justify-center bg-white/90 z-50">
        <div className="relative flex justify-center items-center">
          {/* <div className="absolute animate-spin rounded-full h-36 w-36 border-t-4 border-b-4 border-primary"></div> */}
          {/* <svg
            aria-hidden="true"
            className="absolute w-36 h-36 rounded-0 animate-spin text-transparent fill-primary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
          
            <path
              className="fill-primary"
              d="M93.9996 36C96.425 35.3629 97.351 34.5 97.0077 33.5529C95.293 28.8217 92.8708 24.3682 89.8165 20.347C85.845 15.1182 80.8824 10.7228 75.2122 7.41191C69.542 4.10096 63.2752 1.93927 56.7696 1.05026C51.7664 0.366565 46.6974 0.445867 41.7343 1.27775C39.2611 1.6923 40.3629 3.57452 41 6C41.6372 8.42548 41.5692 10.4707 44.0503 10.1061C47.8509 9.54757 51.7189 9.52591 55.54 10.0481C60.864 10.7756 65.9926 12.5447 70.6329 15.2542C75.2733 17.9638 79.3345 21.5609 82.5847 25.84C84.9173 28.9111 86.7995 32.2903 88.1809 35.8748C88.9996 39 90.3165 37.6252 93.9996 36Z"
              fill="none"
            />
          </svg> */}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-loader-circle animate-spin text-primary size-40 absolute"
          >
            <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
          </svg>
          <img src="/assets/logo/Only-8.svg" alt="logo" className="h-20 w-20" />
        </div>
        <div className="loading-text">
          Loading<span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </div>
      </div>
    </>
  );
}
