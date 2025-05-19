// import { useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import axios, { AxiosError } from "axios";
// import { RootState } from "../../redux/store";
// import { ROUTES } from "../../utils/paths";
// import { Download } from "lucide-react";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

// interface CertificateDetails {
//   studentName: string;
//   instructor: string;
//   courseTitle: string;
//   mark: number;
// }

// interface CertificateResponse {
//   success: boolean;
//   data: CertificateDetails;
// }

// const CertificatePage: React.FC = () => {
//   const { userDetails, loading } = useSelector((state: RootState) => state.user);
//   const { assessmentId } = useParams<{ assessmentId: string }>();
//   const navigate = useNavigate();
//   const [certificate, setCertificate] = useState<CertificateDetails | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const certificateRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (loading) return;
//     if (!userDetails?._id || userDetails?.role !== "student" || !assessmentId) {
//       navigate("/login");
//       return;
//     }

//     const fetchCertificate = async () => {
//       try {
//         const response = await axios.get<CertificateResponse>(
//           `${API_URL}/student/Download_Certificate/${assessmentId}`,
//           { withCredentials: true }
//         );
// console.log(response,'99999999999999999999999999999999999');

//         if (!response.data.success) {
//           throw new Error("Failed to fetch certificate");
//         }

//         setCertificate(response.data.data);
//         setError(null);
//       } catch (err: unknown) {
//         const error = err as AxiosError<{ message?: string }>;
//         console.error("Fetch certificate error:", error);
//         setError(error.response?.data?.message || "Certificate not available.");
//       }
//     };

//     fetchCertificate();
//   }, [userDetails, loading, assessmentId, navigate]);

//   const handleDownloadPDF = async () => {
//     if (!certificateRef.current || !certificate) return;

//     const canvas = await html2canvas(certificateRef.current, {
//       scale: 2,
//       useCORS: true,
//     });
//     const imgData = canvas.toDataURL("image/png");
//     const pdf = new jsPDF({
//       orientation: "landscape",
//       unit: "mm",
//       format: "a4",
//     });

//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = pdf.internal.pageSize.getHeight();
//     const imgWidth = canvas.width;
//     const imgHeight = canvas.height;
//     const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
//     const imgScaledWidth = imgWidth * ratio;
//     const imgScaledHeight = imgHeight * ratio;

//     pdf.addImage(
//       imgData,
//       "PNG",
//       (pdfWidth - imgScaledWidth) / 2,
//       (pdfHeight - imgScaledHeight) / 2,
//       imgScaledWidth,
//       imgScaledHeight
//     );
//     pdf.save(`EduPlatform_Certificate_${certificate.courseTitle}_${certificate.studentName}.pdf`);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error || !certificate) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <p className="text-red-600 text-lg font-semibold" role="alert">
//           {error || "Certificate not available."}
//         </p>
//       </div>
//     );
//   }

//   const completionDate = new Date().toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
//   const certificateId = assessmentId?.slice(-8).toUpperCase();

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
//       <div className="max-w-5xl w-full">
//         {/* Certificate Container */}
//         <div
//           ref={certificateRef}
//           className="bg-white p-12 rounded-lg shadow-2xl border-4 border-yellow-500 relative"
//           style={{ backgroundImage: "linear-gradient(to bottom right, #f5f5f5, #ffffff)" }}
//         >
//           {/* Header */}
//           <div className="text-center mb-8">
//             <img
//               src="/src/assets/images/B (4).png"
//               alt="EduPlatform Logo"
//               className="mx-auto h-16 mb-4"
//             />
//             <h1 className="text-4xl font-bold text-gray-800 font-serif">
//               Certificate of Achievement
//             </h1>
//             <p className="text-lg text-gray-600 mt-2">
//               Awarded by <span className="font-semibold">All Beyond </span>
//             </p>
//           </div>

//           {/* Body */}
//           <div className="text-center mb-8">
//             <p className="text-xl text-gray-700 mb-2">This is to certify that</p>
//             <h2 className="text-3xl font-semibold text-gray-900 capitalize">
//               {certificate.studentName}
//             </h2>
//             <p className="text-xl text-gray-700 mt-4">
//               has successfully completed the course
//             </p>
//             <h3 className="text-2xl font-semibold text-gray-900 mt-2">
//               {certificate.courseTitle}
//             </h3>
//             <p className="text-lg text-gray-600 mt-4">
//               with a score of <span className="font-semibold">{certificate.mark}%</span>
//             </p>
//             <p className="text-lg text-gray-600 mt-2">
//               on <span className="font-semibold">{completionDate}</span>
//             </p>
//             <p className="text-lg text-gray-600 mt-2">
//               Instructed by <span className="font-semibold">{certificate.instructor}</span>
//             </p>
//           </div>

//           {/* Footer */}
//           <div className="flex justify-between items-center mt-12">
//             <div className="text-center">
//               <p className="text-gray-600">_______________________</p>
//               <p className="text-gray-700 font-semibold">Instructor Signature</p>
//             </div>
//             <div className="text-center">
//               <p className="text-gray-600">Certificate ID: {certificateId}</p>
//             </div>
//             <div className="text-center">
//               <p className="text-gray-600">_______________________</p>
//               <p className="text-gray-700 font-semibold">Director Signature</p>
//             </div>
//           </div>

//           {/* Decorative Seal */}
//           <div className="absolute bottom-8 right-8 w-24 h-24 bg-yellow-200 rounded-full flex items-center justify-center opacity-80">
//             <span className="text-yellow-800 text-sm font-semibold text-center">
//               Official Seal
//             </span>
//           </div>
//         </div>

//         {/* Download Button */}
//         <div className="mt-6 text-center">
//           <button
//             onClick={handleDownloadPDF}
//             className="flex items-center justify-center mx-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             aria-label="Download Certificate as PDF"
//           >
//             <Download className="w-5 h-5 mr-2" />
//             Download Certificate
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CertificatePage;





import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { RootState } from "../../redux/store";
import { ROUTES } from "../../utils/paths";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:5000";

interface CertificateDetails {
  studentName: string;
  instructor: string;
  courseTitle: string;
  mark: number;
}

interface CertificateResponse {
  success: boolean;
  data: CertificateDetails;
}

const CertificatePage: React.FC = () => {
  const { userDetails, loading } = useSelector((state: RootState) => state.user);
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState<CertificateDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const certificateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;
    if (!userDetails?._id || userDetails?.role !== "student" || !assessmentId) {
      navigate("/login");
      return;
    }

    const fetchCertificate = async () => {
      try {
        const response = await axios.get<CertificateResponse>(
          `${API_URL}/student/Download_Certificate/${assessmentId}`,
          { withCredentials: true }
        );
        console.log(response, "99999999999999999999999999999999999");

        if (!response.data.success) {
          throw new Error("Failed to fetch certificate");
        }

        setCertificate(response.data.data);
        setError(null);
      } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;
        console.error("Fetch certificate error:", error);
        setError(error.response?.data?.message || "Certificate not available.");
      }
    };

    fetchCertificate();
  }, [userDetails, loading, assessmentId, navigate]);

  const handleDownloadPDF = async () => {
    if (!certificateRef.current || !certificate) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: 2,
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgScaledWidth = imgWidth * ratio;
    const imgScaledHeight = imgHeight * ratio;

    pdf.addImage(
      imgData,
      "PNG",
      (pdfWidth - imgScaledWidth) / 2,
      (pdfHeight - imgScaledHeight) / 2,
      imgScaledWidth,
      imgScaledHeight
    );
    pdf.save(`EduPlatform_Certificate_${certificate.courseTitle}_${certificate.studentName}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600"></div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg font-semibold" role="alert">
          {error || "Certificate not available."}
        </p>
      </div>
    );
  }

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const certificateId = assessmentId?.slice(-8).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        {/* Certificate Container */}
        <div
          ref={certificateRef}
          className="bg-white p-12 rounded-lg shadow-2xl border-4 border-yellow-600 relative"
          style={{ backgroundImage: "linear-gradient(to bottom right, #f5f5f5, #ffffff)" }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <img
              src="/src/assets/images/B (4).png"
              alt="EduPlatform Logo"
              className="mx-auto h-16 mb-4"
            />
            <h1 className="text-4xl font-bold text-gray-800 font-serif">
              Certificate of Achievement
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Awarded by <span className="font-semibold">All Beyond</span>
            </p>
          </div>

          {/* Body */}
          <div className="text-center mb-10">
            <p className="text-xl text-gray-700 mb-2">This is to certify that</p>
            <h2 className="text-3xl font-semibold text-gray-900 capitalize">
              {certificate.studentName}
            </h2>
            <p className="text-xl text-gray-700 mt-4">
              has successfully completed the course
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 mt-2">
              {certificate.courseTitle}
            </h3>
            <p className="text-lg text-gray-600 mt-4">
              with a score of <span className="font-semibold">{certificate.mark}%</span>
            </p>
            <p className="text-lg text-gray-600 mt-2">
              on <span className="font-semibold">{completionDate}</span>
            </p>
            <p className="text-lg text-gray-600 mt-2">
              Instructed by <span className="font-semibold">{certificate.instructor}</span>
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-12">
            <div className="text-center">
              <p
                className="text-2xl text-gray-800 font-signature"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                {certificate.instructor}
              </p>
              <p className="text-gray-700 font-semibold mt-1">Instructor Signature</p>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Certificate ID: {certificateId}</p>
            </div>
            <div className="text-center">
              <p
                className="text-2xl text-gray-800 font-signature"
                style={{ fontFamily: "'Great Vibes', cursive" }}
              >
                All Beyond
              </p>
              <p className="text-gray-700 font-semibold mt-1">Director Signature</p>
            </div>
          </div>


        </div>

        {/* Download Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center justify-center mx-auto bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Download Certificate as PDF"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Certificate
          </button>
        </div>
      </div>

      {/* Google Fonts for Signature */}
      <link
        href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
        rel="stylesheet"
      />
    </div>
  );
};

export default CertificatePage;