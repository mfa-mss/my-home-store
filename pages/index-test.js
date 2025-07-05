import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>My Home Store - Test</title>
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            🏠 My Home Store
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Welcome to our beautiful home store!
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Website is Loading!</h2>
            <p className="text-gray-600">
              If you can see this, the basic setup is working.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
