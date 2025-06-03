import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col">
      <div className="mt-20 flex justify-center">
        <div className="flex items-center space-x-2">
          <img src="/locked.png" alt="Logo" className="h-12 w-12" />
          <h1 className="text-3xl font-bold">Secure Password Manager</h1>
        </div>
        </div>
      <div className="flex-grow flex items-start justify-center pt-20">
        <RegisterForm />
      </div>

    </div>
  );
}

export default RegisterPage;
