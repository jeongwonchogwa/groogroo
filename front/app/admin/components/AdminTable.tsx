'use client'
import React, { useState } from "react";
import { Report } from  "@/app/types";
import ReportContentModal from "./ReportContentModal";
import AdminExpelModal from "./AdminExpelModal";
import AdminDeleteModal from "./AdminDeleteModal";

interface AdminTableProp {
  reportList: Report[];
  sortType: null | true | false;
  clickExpel: (reportedId: number) => void;
  clickDelete: (contentType:string, targetId:number) => void;
  clickDetail: (contentType:string, targetId:number, reportId:number) => void;
}

const AdminTable = ({ reportList, sortType, clickExpel, clickDelete, clickDetail }: AdminTableProp) => {

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showExpelModal, setShowExpelModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");
  const [reportedId, setReportId] = useState<number>(0);
  const [reportedEmail, setReportedEmail] = useState<string>("");
  const [contentType, setContentType] = useState<string>("");
  const [targetId, setTargetId] = useState<number>(0);

  const handleClickReport = (content: string) => {
    setModalContent(content);
    setShowModal(true);
  };

  const handleClickExpel = (reportedId: number, reportedEmail: string) => {
    setReportId(reportedId);
    setReportedEmail(reportedEmail)
    setShowExpelModal(true);
  };

  const handleClickDelete = (contentType: string, targetId: number) => {
    setContentType(contentType);
    setTargetId(targetId);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setShowExpelModal(false);
    setShowDeleteModal(false);

    setContentType("");
    setTargetId(0);

    setModalContent("");

    setReportId(0);
    setReportedEmail("");
  };

  const callClickExpel = () => {
    clickExpel(reportedId);
    closeModal();
  }

  const callClickDelete = () => {
    clickDelete(contentType, targetId);
    closeModal();
  }

  return (
    <div className="w-full h-[500px] mt-4 p-4">
      <table className="table-fixed w-full">
        <thead className="border-b w-full">
          <tr className="w-full font-nexonGothic_Bold text-lg ">
            <th className="text-center w-[50px]">#</th>
            <th className="text-center w-[150px]">신고자</th>
            <th className="text-center w-[100px]">TYPE</th>
            <th className="text-center w-[50px]">ID</th>
            <th className="text-center w-[150px]">EMAIL</th>
            <th className="text-center w-[400px]">CONTENT</th>
            <th className="text-center w-[150px]">STATE</th>
            <th className="text-center w-[100px]">ACTION</th>
          </tr>
        </thead>
        {reportList && reportList.map((report, idx) => {
            if (sortType === null || sortType === report.completed) {
              return (
                <tbody className="h-[40px]" key={idx}>
                  <tr className="border-b">
                    <td className="flex justify-center whitespace-nowrap px-6 py-2 font-nexonGothic_Bold">{report.id}</td>
                    <td className="text-center whitespace-nowrap px-6 py-2 font-nexonGothic_Medium">{report.reporterEmail}</td>
                    <td className="text-center whitespace-nowrap px-6 py-2 font-nexonGothic_Medium">{report.contentType}</td>
                    <td className="flex justify-center whitespace-nowrap px-6 py-2 font-nexonGothic_Medium text-base text-blue-600"
                    onClick={()=> clickDetail(report.contentType, report.targetId, report.id)}>{report.targetId}</td>
                    <td className="text-center whitespace-nowrap px-6 py-2 font-nexonGothic_Medium">{report.reportedEmail}</td>
                    <td
          className="text-center truncate whitespace-nowrap px-6 py-2 font-nexonGothic_Medium  text-blue-600"
          onClick={() => handleClickReport(report.content)}
        >
          {report.content}
                    </td>
                    <td className="text-center font-nexonGothic_Medium  text-base">
                      {report.completed === true ? (
                        <div className="bg-primary-container rounded-lg mx-10">
                          <span className=" text-white">완료</span>
                        </div>
                      ) : (
                        <div className="bg-error-container rounded-lg mx-10">
                          <span className=" text-white">처리중</span>
                        </div>
                      )}
                    </td>
                    <td className="w-full">
                      <div className=" w-full h-[40px] flex flex-row gap-2 mx-auto">
                        <button
                          className="w-full flex items-center justify-center text-white bg-error rounded-lg py-2 my-1 font-nexonGothic_Medium text-base"
                          // onClick={() => clickExpel(report.reportedId)}
                          onClick={()=>handleClickExpel(report.reportedId, report.reportedEmail)}
                        >
                          차단
                        </button>
                        <button
                          className="w-full flex items-center justify-center text-white bg-primary rounded-lg py-2 my-1 font-nexonGothic_Medium text-base"
                          onClick={() => handleClickDelete(report.contentType, report.targetId)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            }
            return null;
          })}
      </table>
      {showModal && (
        <ReportContentModal content={modalContent} onClose={closeModal} />
      )}
      {showExpelModal && reportedEmail !== null &&(
        <AdminExpelModal reportedEmail={reportedEmail} onConfirm={callClickExpel} onCancel={closeModal} />
      )}
      {showDeleteModal &&(
        <AdminDeleteModal contentType={contentType} targetId={targetId} onConfirm={callClickDelete} onCancel={closeModal} />
      )}
    </div>
  );
};

export default AdminTable;
