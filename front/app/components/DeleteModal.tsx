import { userTreeStore } from "@/stores/userTreeStore";
import ButtonModal from "./ButtonModal";
import Button from "./Button";

interface Props {
  handleDeleteModal: () => void;
  id: number;
}

const DeleteModal = (props: Props) => {
  const { userTree, setUserTree } = userTreeStore();
  // 삭제 버튼 누르고 나면 실행할 함수
  const handleDelete = (id: number) => {
    fetchDelete(id);
  };

  const fetchDelete = (id: number) => {
    fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/fruit/${id}`, {
      method: "DELETE",
    }).then((res) => {
      if (res.status === 200) {
        if (userTree) {
          const updatedUserTree = { ...userTree };
          updatedUserTree.fruits = userTree?.fruits?.filter(
            (fruit) => fruit.id !== id
          );
          setUserTree(updatedUserTree);
        }
      } else {
        console.log("삭제 실패");
      }
    });
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
                console.log("삭제 클릭");
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
