import React from 'react';

const Home: React.FC = () => {
  return (
    <div className="bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Communication Assessment Platform </h1>
        </div>
      </header>

      <main>
        <section className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Accurate Transcripts which support Indian accents in multiple languages
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  Our AI-powered platform transcribes your live videos in real-time, with detailed speech analysis reports to help you better understand your audience.
                </p>
                <div className="mt-8">
                  <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Get Started
                  </a>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:grid-cols-2">
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <img className="max-h-12" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <img className="max-h-12" src="https://tailwindui.com/img/logos/tuple-logo-indigo-600.svg" alt="Tuple" />
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <img className="max-h-12" src="https://tailwindui.com/img/logos/savvycal-logo-indigo-600.svg" alt="SavvyCal" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Features to Boost Your Productivity
                </h2>
                <dl className="mt-6 space-y-6">
                  <div className="flex">
                    <dt className="flex-shrink-0">
                      <div className="bg-indigo-500 rounded-md p-3 text-white">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </dt>
                    <dd className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Real-Time Transcription</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Get accurate transcripts as your videos are recorded, with support for 20+ Indian languages.
                      </p>
                    </dd>
                  </div>

                  <div className="flex">
                    <dt className="flex-shrink-0">
                      <div className="bg-indigo-500 rounded-md p-3 text-white">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </dt>
                    <dd className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Speech Analysis</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Receive detailed reports on speaker sentiment, pace, volume, and more to improve your communication.
                      </p>
                    </dd>
                  </div>

                  <div className="flex">
                    <dt className="flex-shrink-0">
                      <div className="bg-indigo-500 rounded-md p-3 text-white">
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </dt>
                    <dd className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">Integrations</h3>
                      <p className="mt-2 text-base text-gray-500">
                        Seamlessly integrate our platform with your favorite video conferencing tools, CRMs, and more.
                      </p>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-10 sm:mt-0">
                <div className="relative">
                  <img className="w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80" alt="App screenshot" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="lg:col-start-2">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  What Our Customers Say
                </h2>
                <blockquote className="mt-6">
                  <div className="text-base text-gray-500">
                    <p>
                      "The real-time transcription and speech analysis have been game-changers for our remote team meetings. We're able to better understand each other and improve our communication."
                    </p>
                  </div>
                  <footer className="mt-4">
                    <div className="flex items-center space-x-3">
                      <img className="h-6 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                      <div className="text-base font-medium text-gray-700">
                        Judith Black, CEO at Acme Corp
                      </div>
                    </div>
                  </footer>
                </blockquote>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-0.5 md:grid-cols-3 lg:mt-0 lg:col-start-1">
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <img className="max-h-12" src="https://tailwindui.com/img/logos/transistor-logo-indigo-600.svg" alt="Transistor" />
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <img className="max-h-12" src="https://tailwindui.com/img/logos/mirage-logo-indigo-600.svg" alt="Mirage" />
                </div>
                <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                  <img className="max-h-12" src="https://tailwindui.com/img/logos/statickit-logo-indigo-600.svg" alt="StaticKit" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-100">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                  Get Started Today
                </h2>
                <p className="mt-3 text-lg text-gray-500">
                  Sign up for a free trial and see how our video transcription and analysis platform can improve your communication.
                </p>
                <div className="mt-8">
                  <a href="#" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Start Your Free Trial
                  </a>
                </div>
              </div>
              <div className="mt-8 lg:mt-0">
                <div className="relative">
                  <img className="w-full rounded-lg shadow-lg" src="https://images.unsplash.com/photo-1516242992733-fd57ee741057?crop=entropy&cs=tinysrgb&fit=max&ixid=MXwyMDg5MnwwfDF8c2VhcmNofDkxfHxib3JkZXJ8ZW58MHx8fHwxNjY5Njg3NjE3&ixlib=rb-1.2.1&q=80&w=1080" alt="Getting Started" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
