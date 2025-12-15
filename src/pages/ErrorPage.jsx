import React from 'react'
import error from '../assets/error-404.png'

const ErrorPage = () => {
  return (
    <div className="justify-center items-center text-center">
      <div className="justify-center items-center text-center flex">
        <img src={error} alt="" className="object-cover" />
      </div>
      <div>
        <h1 className="text-4xl text-black text-center font-bold mt-2">
          Oops, page not found!
        </h1>
        <p className="text-md mt-4 text-black text-center">
          The page you are looking for is not available.
        </p>
        <div className="mt-4 text-center">
          <a
            href="/"
            className="btn gradient-bg border-none hover:bg-indigo-700 text-white px-6 py-3 rounded-md transition"
          >
            Go Back!
          </a>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage