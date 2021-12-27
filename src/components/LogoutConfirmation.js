const LogoutConfirmation = ({ showModal, closeModal, confirm }) => {
  //   const [showModal, setShowModal] = React.useState(showModal);
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*body*/}
                <div className="relative px-6 flex-auto">
                  <p className="my-4 text-blueGray-500 text-xl leading-relaxed">
                    Are you sure you want to logout?
                  </p>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end px-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => closeModal(false)}
                  >
                    No
                  </button>
                  <button
                    className="bg-indigo-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-1 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => confirm()}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default LogoutConfirmation;
