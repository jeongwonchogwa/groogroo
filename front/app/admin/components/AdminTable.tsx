'use client'

import Link from "next/link";
// import { admin } from "@/app/dummies";
import { Report } from  "@/app/types";
import { useEffect, useState } from 'react';
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";

interface AdminTableProp {
  reportList: Report[];
  sortType: null | true | false;
  clickExpel: (reportedId: number) => void;
  clickDelete: (targetId: number, contentType: string) => void;
}

const AdminTable = ({ reportList, sortType, clickExpel, clickDelete }: AdminTableProp) => {

  return (
    <div className="w-full h-[500px] mt-4 p-4">
      <table className="table-fixed w-full">
        <thead className="border-b w-full">
          <tr className="w-full">
            <th className="text-center w-[50px]">#</th>
            <th className="font-neoDunggeunmo_Pro text-lg text-center">신고자</th>
            <th className="text-center w-[150px]">TYPE</th>
            <th className="text-center w-[50px]">ID</th>
            <th className="font-neoDunggeunmo_Pro text-lg text-center">EMAIL</th>
            <th className="text-center w-[200px]">STATE</th>
            <th className="text-center">ACTION</th>
          </tr>
        </thead>
        {reportList && reportList.map((report, idx) => {
            if (sortType === null || sortType === report.completed) {
              return (
                <tbody className="h-[40px]" key={idx}>
                  <tr className="border-b">
                    <td className="flex justify-center whitespace-nowrap px-6 py-2 font-bitBit">{report.id}</td>
                    <td className="text-center whitespace-nowrap px-6 py-2 font-bitBit">{report.reporterEmail}</td>
                    <td className="text-center whitespace-nowrap px-6 py-2 font-bitBit">{report.contentType}</td>
                    <td className="flex justify-center whitespace-nowrap px-6 py-2 font-bitBit text-base">
                      <Link href={`/admin/${report.id}`}>{report.targetId}</Link>
                    </td>
                    <td className="text-center whitespace-nowrap px-6 py-2 font-bitBit">{report.reportedEmail}</td>
                    <td className="text-center font-nexonGothic text-base">
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
                          onClick={() => clickExpel(report.reportedId)}
                        >
                          추방
                        </button>
                        <button
                          className="w-full flex items-center justify-center text-white bg-primary rounded-lg py-2 my-1 font-nexonGothic_Medium text-base"
                          onClick={() => clickDelete(report.targetId, report.contentType)}
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
    </div>
  );
};

export default AdminTable;
