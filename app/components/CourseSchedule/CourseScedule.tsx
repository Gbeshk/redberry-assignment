import React from "react";
import WeeklyScheduleIcon from "../icons/WeeklyScheduleIcon";
import TimeSlotIcon from "../icons/TimeSlotIcon";
import ArrowIcon from "../icons/ArrowIcon";
import MorningIcon from "../icons/MorningIcon";
import AfternoonIcon from "../icons/AfternoonIcon";
import EveningIcon from "../icons/EveningIcon";
import SessionIcon from "../icons/SessionIcon";
import OnlineIcon from "../icons/OnlineIcon";
import InPersonIcon from "../icons/InPersonIcon";
import LocationIcon from "../icons/LocationIcon";
import WarningIcon from "../icons/WarningIcon";
import HybridIcon from "../icons/HybridIcon";

function CourseScedule({ courseId }: { courseId: string }) {
  return (
    <>
      <div className="w-[530px] ">
        <div className="w-[530px]">
          <div className="h-[30px] flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <WeeklyScheduleIcon />
              <p className="text-[#130E67]  font-semibold text-[24px] leading-none tracking-normal">
                Weekly Schedule
              </p>
            </div>
            <ArrowIcon />
          </div>

          <div className="w-full h-[91px]  mt-[18px] flex items-center justify-between gap-[12px]">
            <div className=" text-[#292929] h-full font-semibold text-[16px] leading-none tracking-normal text-centerh-full border-[1px] border-[#D1D1D1] rounded-[12px] flex items-center justify-center bg-white w-full">
              Mon - Wed
            </div>
            <div className=" text-[#D1D1D1] h-full font-semibold text-[16px] leading-none tracking-normal text-centerh-full border-[1px] border-[#D1D1D1] rounded-[12px] flex items-center justify-center bg-[#F5F5F5] w-full">
              Tue - Thu
            </div>
            <div className=" text-[#292929] h-full font-semibold text-[16px] leading-none tracking-normal text-centerh-full border-[1px] border-[#D1D1D1] rounded-[12px] flex items-center justify-center bg-white w-full">
              Wed - Fri
            </div>
            <div className=" text-[#292929] h-full font-semibold text-[16px] leading-none tracking-normal text-centerh-full border-[1px] border-[#D1D1D1] rounded-[12px] flex items-center justify-center bg-white w-full">
              Weekend
            </div>
          </div>
        </div>

        <div className="w-[530px] mt-[32px]">
          <div className="h-[29px] flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <TimeSlotIcon />

              <p className="text-[#8A8A8A]  font-semibold text-[24px] leading-none tracking-normal">
                Time Slot
              </p>
            </div>
            <ArrowIcon />
          </div>
          <div className="w-full h-[61px]  mt-[18px] flex items-center justify-between gap-[6px]">
            <div className=" p-[15px] rounded-[12px] bg-white border-[1px] h-[61px] border-[#D1D1D1] w-full flex items-center justify-center gap-[12px]">
              <MorningIcon />
              <div className="flex flex-col h-[31px] justify-center  gap-[2px]">
                <p className="h-[17px] flex items-center text-[#666666]  font-medium text-[14px] leading-none tracking-normal">
                  Morning
                </p>
                <p className="h-[12px] flex items-center text-[#666666]   font-normal text-[10px] leading-none tracking-normal">
                  9:00 AM – 12:00 PM
                </p>
              </div>
            </div>
            <div className=" p-[15px] rounded-[12px] h-[61px] bg-white w-full border-[1px] border-[#D1D1D1] flex items-center justify-center gap-[12px]">
              <AfternoonIcon />

              <div className="flex flex-col h-[31px] justify-center  gap-[2px]">
                <p className="h-[17px] flex items-center text-[#666666]  font-medium text-[14px] leading-none tracking-normal">
                  Afternoon
                </p>
                <p className="h-[12px] flex items-center text-[#666666]   font-normal text-[10px] leading-none tracking-normal">
                  12:00 AM – 6:00 PM
                </p>
              </div>
            </div>
            <div className=" p-[15px] rounded-[12px] h-[61px] bg-[#F5F5F5] w-full flex items-center border-[1px] border-[#D1D1D1] justify-center gap-[12px]">
              <EveningIcon />
              <div className="flex flex-col h-[31px] gap-[2px]">
                <p className="h-[17px] flex items-center text-[#D1D1D1]  font-medium text-[14px] leading-none tracking-normal">
                  Evening
                </p>
                <p className="h-[12px] flex items-center text-[#D1D1D1]   font-normal text-[10px] leading-none tracking-normal">
                  6:00 AM – 9:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[530px] mt-[32px]">
          <div className="h-[29px] flex items-center justify-between">
            <div className="flex items-center gap-[8px]">
              <SessionIcon />

              <p className="text-[#8A8A8A]  font-semibold text-[24px] leading-none tracking-normal">
                Session Type
              </p>
            </div>
            <ArrowIcon />
          </div>

          <div className="w-full mt-[18px] grid h-[155px] grid-cols-3 gap-[8px]">
            <div className="flex-1 h-[full] flex flex-col items-center justify-between">
              <div className=" py-[15px] px-[20px] rounded-[12px] bg-white border-[1px] h-[131px] border-[#D1D1D1] w-full flex flex-col items-center justify-center ">
                <OnlineIcon />
                <p className="text-[#525252]  font-semibold text-[16px] leading-none tracking-normal text-center h-[19px] flex items-center mt-[6px]">
                  Online
                </p>
                <p className="text-[#525252] h-[15px] flex items-center mt-[6px] font-normal text-[12px] leading-none tracking-normal">
                  Google Meet
                </p>
                <p className="text-[#736BEA] h-[17px] flex items-center mt-[12px] font-medium text-[14px] leading-none tracking-normal ">
                  Included
                </p>
              </div>
              <p className="text-[#3D3D3D] font-medium text-[12px] leading-none tracking-normal">
                50 Seats Available
              </p>
            </div>

            <div className="flex-1 h-full flex flex-col items-center justify-between">
              <div className=" py-[15px] px-[20px] rounded-[12px] bg-white border-[1px] h-[131px] border-[#D1D1D1] w-full flex flex-col items-center justify-center ">
                <InPersonIcon />

                <p className="text-[#525252]  font-semibold text-[16px] leading-none tracking-normal text-center h-[19px] flex items-center mt-[6px]">
                  In-Person
                </p>
                <div className="flex h-[15px] items-center mt-[6px] w-[132px] gap-[2px]">
                  <LocationIcon />

                  <p className="text-[#525252] flex items-center  font-normal text-[12px] leading-none tracking-normal">
                    Chavchavadze St.34
                  </p>
                </div>

                <p className="text-[#736BEA] h-[17px] flex items-center mt-[12px]  font-medium text-[14px] leading-none tracking-normal ">
                  + $30
                </p>
              </div>
              <div className="flex items-center gap-[4px]">
                <WarningIcon />
                <p className="font-medium text-[12px] text-[#F4A316] leading-none tracking-normal">
                  Only 3 Seats Remaining
                </p>
              </div>
            </div>

            <div className="flex-1 h-full flex flex-col items-center justify-between">
              <div className=" py-[15px] px-[20px] rounded-[12px] bg-white border-[1px] h-[131px] border-[#D1D1D1] w-full flex flex-col items-center justify-center ">
                <HybridIcon />

                <p className="text-[#525252]  font-semibold text-[16px] leading-none tracking-normal text-center h-[19px] flex items-center mt-[6px]">
                  Hybrid
                </p>
                <div className="flex h-[15px] items-center mt-[6px] w-[132px] gap-[2px]">
                  <LocationIcon />

                  <p className="text-[#525252] flex items-center  font-normal text-[12px] leading-none tracking-normal">
                    Chavchavadze St.34
                  </p>
                </div>

                <p className="text-[#736BEA] h-[17px] flex items-center mt-[12px]  font-medium text-[14px] leading-none tracking-normal ">
                  + $50
                </p>
              </div>
              <p className="text-[#3D3D3D] font-medium text-[12px] leading-none tracking-normal">
                50 Seats Available
              </p>
            </div>
          </div>
        </div>
        <div className="w-[530px] h-[306px] bg-white rounded-[12px] mt-[32px] flex items-center flex-col p-[40px]">
          <div className="w-[450px] h-[39px] flex items-center justify-between">
            <p className="text-[#8A8A8A] font-semibold text-[20px] leading-[24px] tracking-normal">
              Total Price
            </p>
            <p className="text-[#292929] font-semibold text-[32px] leading-none tracking-normal text-right">
              $349
            </p>
          </div>
          <div className="h-[24px] flex items-center justify-between w-[450px] mt-[32px]">
            <p className="text-[#8A8A8A] font-medium text-[16px] leading-[24px] tracking-normal">
              Base Price
            </p>
            <p className="text-[#292929] font-medium text-[16px] leading-[24px] tracking-normal flex items-center justify-end gap-[4px]">
              <span className="translate-y-[-1px]">+</span>
              <span>$0</span>
            </p>
          </div>
          <div className="h-[24px] flex items-center justify-between w-[450px] mt-[12px]">
            <p className="text-[#8A8A8A] font-medium text-[16px] leading-[24px] tracking-normal">
              Session Type
            </p>
            <p className="text-[#292929] font-medium text-[16px] leading-[24px] tracking-normal flex items-center justify-end gap-[4px]">
              <span className="translate-y-[-1px]">+</span>
              <span>$0</span>
            </p>
          </div>
          <div className="w-[450px] h-[63px] bg-[#EEEDFC] rounded-[12px] mt-[32px] text-[#B7B3F4] font-semibold text-[20px] leading-[24px] tracking-normal flex items-center justify-center">
            Enroll Now
          </div>
        </div>
      </div>
    </>
  );
}

export default CourseScedule;
