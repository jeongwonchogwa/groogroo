import { userTreeStore } from "@/stores/userTreeStore";
import ButtonModal from "../../../components/ButtonModal";
import Button from "../../../components/Button";
import { userInfoStore } from "@/stores/userInfoStore";

interface Props {
  yesFunction: () => void;
  noFunction: () => void;
  title: string;
  question: string;
  yesMessage: string;
}

const YesNoModal = (props: Props) => {
  return (
    <div>
      <ButtonModal
        isOpenModal={true}
        handleModal={props.yesFunction}
        state="success"
        title={props.title}
        content={<div>{props.question}</div>}
        button={
          <div className="grid grid-flow-col gap-2">
            <Button
              color="default"
              label="취소"
              onClick={() => {
                props.noFunction();
              }}
            />
            <Button
              color="primary"
              label={props.yesMessage}
              onClick={() => {
                props.yesFunction();
              }}
            />
          </div>
        }
      />
    </div>
  );
};

export default YesNoModal;
