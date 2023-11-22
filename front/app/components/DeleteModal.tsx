import { userTreeStore } from "@/stores/userTreeStore";
import ButtonModal from "./ButtonModal";
import Button from "./Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useUserToken from "../hooks/useUserToken";
import { useRouter } from "next/navigation";

interface Props {
  handleDeleteModal: () => void;
  id: number;
  isSearch?: boolean;
}

const DeleteModal = (props: Props) => {
  const queryClient = useQueryClient();

  // 삭제 로직을 useMutation으로 처리
  const { mutate } = useMutation(
    async (id: number) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/fruit/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("삭제 실패");
      }

      return id;
    },
    {
      onSuccess: (id) => {
        if (props.isSearch) {
          queryClient.setQueryData(["searchResultData"], (oldData: any) => {
            return {
              ...oldData,
              fruits: oldData?.fruits?.filter((fruit: any) => fruit.id !== id),
            };
          });
        } else {
          queryClient.setQueryData(["userTree"], (oldData: any) => {
            return {
              ...oldData,
              fruits: oldData?.fruits?.filter((fruit: any) => fruit.id !== id),
            };
          });
        }
      },
    }
  );

  const handleDelete = (id: number) => {
    mutate(id);
  };

  return (
    <div>
      <ButtonModal
        isOpenModal={true}
        handleModal={props.handleDeleteModal}
        state="error"
        title="열매 삭제"
        content={
          <div>
            열매를 삭제하시겠습니까? <br /> 삭제된 열매는 복구할 수 없습니다.
          </div>
        }
        button={
          <div className="grid grid-flow-col gap-2">
            <Button
              color="default"
              label="취소"
              onClick={() => {
                props.handleDeleteModal();
              }}
            />
            <Button
              color="error"
              label="삭제"
              onClick={() => {
                handleDelete(props.id);
                props.handleDeleteModal();
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export default DeleteModal;
