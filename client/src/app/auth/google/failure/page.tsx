import Container from "@/components/container";
import { Parag } from "@/components/text";
import { Button } from "@/components/ui/button";
import { AuthPages, Routes } from "@/lib/constants";
import { AlertTriangle, ArrowLeft, XCircle } from "lucide-react";
import Link from "next/link";

const GoogleFailurePage = () => {
  return (
    <Container className={"flex items-center justify-center min-h-screen"}>
      <div className={"flex flex-col max-w-2xl py-10"}>
        {/* Icon d'erreur */}
        <div className="flex justify-center mb-6">
          <div className="size-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="size-10 text-red-500" />
          </div>
        </div>

        {/* Message principal */}
        <div className="text-center mb-6">
          <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Google Sign-In Failed
          </h2>
          <Parag className="text-gray-600 leading-relaxed">
            We couldn't complete your Google authentication. This might have
            happened because you cancelled the process or there was a connection
            issue.
          </Parag>
        </div>

        {/* Raisons possibles */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm xs:text-base font-semibold text-amber-900 mb-2">
                Common reasons:
              </h3>
              <ul className="text-xs xs:text-sm text-amber-700 space-y-1">
                <li>• Authentication was cancelled</li>
                <li>• Pop-up was blocked by your browser</li>
                <li>• Network connection interrupted</li>
                <li>• Google account access denied</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="space-y-3">
          <Button variant="outline" className="w-full" size={"lg"} asChild>
            <Link href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>{" "}
              Login with Google
            </Link>
          </Button>
          <Button variant="primary" className="w-full" size={"lg"} asChild>
            <Link href={`/${Routes.AUTH}/${AuthPages.LOGIN}`}>
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default GoogleFailurePage;
