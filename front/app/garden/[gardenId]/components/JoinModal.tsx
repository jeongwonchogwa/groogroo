import { userTreeStore } from "@/stores/userTreeStore";
import ButtonModal from "../../../components/ButtonModal";
import Button from "../../../components/Button";
import { userInfoStore } from "@/stores/userInfoStore";
import { fetchWithTokenCheck } from "@/app/components/FetchWithTokenCheck";
import { useRouter } from "next/navigation";

interface Props {
  onJoinButtonClick: () => void;
  onFormCloseButtonClick: () => void;
  gardenId: number;
}

const JoinModal = (props: Props) => {
  const router = useRouter();
  const { userToken } = userInfoStore();
  // 삭제 버튼 누르고 나면 실행할 함수
  const handleJoin = () => {
    fetchJoin();
  };

  const fetchJoin = () => {
    fetchWithTokenCheck(
      `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/garden/process/${props.gardenId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      },
      router
    ).then((res) => {
      if (res.status === 200) {
        console.log("요청 성공");
      } else {
        console.log("삭제 실패");
      }
    });
  };

  return (
    <div>
      <ButtonModal
        isOpenModal={true}
        handleModal={props.onJoinButtonClick}
        state="success"
        title="정원 가입"
        content={<div>가입 요청을 보내시겠습니까?</div>}
        button={
          <div className="grid grid-flow-col gap-2">
            <Button
              color="default"
              label="취소"
              onClick={() => {
                props.onFormCloseButtonClick();
              }}
            />
            <Button
              color="primary"
              label="가입하기"
              onClick={() => {
                handleJoin();
                props.onJoinButtonClick();
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export default JoinModal;
