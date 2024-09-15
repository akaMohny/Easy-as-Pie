const Spinner = ({ show }) => (
    <div
        className={`fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-500
            ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className='animate-spin rounded-full h-12 w-12 border-4 border-l-fuchsia-300 border-r-fuchsia-600'></div>
    </div>
);
export default Spinner;