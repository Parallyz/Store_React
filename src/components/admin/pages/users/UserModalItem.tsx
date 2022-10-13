import { AlertType, User } from "../../../../models/models";
import React, { FormEvent, useEffect, useRef, useState } from "react";

import InputSelect from "../../../input/InputSelect";
import Modal from "../../../modal/Modal";
import { useAddUserMutation } from "../../../../redux/user/user.api";
import { useAppActions } from "../../../../hooks/actions";
import { useAppSelector } from "../../../../hooks/redux";

interface IOption {
  value: string;
  label: string;
}

const options: IOption[] = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const UserModalItem = () => {
  const [createUser, { isError, isLoading, data }] = useAddUserMutation();
  const { setStateUserModal, setStateAlert } = useAppActions();
  const { isUserModal } = useAppSelector((state) => state.users);

  const [name, setName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File>(null);
  const selectedFileBlock = useRef<HTMLDivElement>();
  const [preview, setPreview] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<IOption>(null);

  const addUserHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user: User = {
      firstName: name,
      lastName,
      image: preview,
      gender: selectedGender?.value || "male",
    };

    console.log(preview);

    createUser(user);
    resetStates();
    setStateUserModal(false);
  };

  const closeModalHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setStateUserModal(false);
  };

  //? Preview img on select change
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    selectedFileBlock.current.classList.add("file--downloaded");
    const label = selectedFileBlock.current.children.item(0);
    label.innerHTML = "Downloaded !";
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const resetStates = () => {
    setName("");
    setLastName("");
    setSelectedFile(null);
    setPreview("");
    setSelectedGender(null);
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);

    //console.log(selectedFile);

    //var reader = new FileReader();
    //reader.onload = function () {
    //  setSelectedFile(this.result);
    //};
    //reader.readAsDataURL(e.target.files[0]);
  };
  //?  Add onError
  useEffect(() => {
    if (isError) {
      setStateAlert({
        text: "Error on Add",
        type: AlertType.Error,
        isShow: true,
      });
    }
  }, [isError]);

  //? Add on Error
  useEffect(() => {
    if (!isLoading && !isError && data) {
      console.log("Add response", data);
      setStateAlert({
        text: "Added successfully",
        type: AlertType.Success,
        isShow: true,
      });
    }
  }, [isLoading]);

  return (
    <Modal isOpen={isUserModal} onClose={() => setStateUserModal(false)}>
      <div className="user__modal">
        <h2>Add User</h2>
        <form
          className="form user__form"
          onSubmit={(e: FormEvent<HTMLFormElement>) => addUserHandler(e)}
        >
          <div className="form__group  ">
            <label>
              First name:
              <input
                className="input input--default input--text"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>
          <div className="form__group ">
            <label>
              Last name:
              <input
                className="input input--default  input--text"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>
          <div className="form__group form__group-select  input input--select">
            <label>Select option :</label>

            <InputSelect
              value={selectedGender}
              setValue={setSelectedGender}
              options={options}
            />
          </div>
          <div ref={selectedFileBlock} className="form__group file-area ">
            <label>
              Images Your images should be at least 400x300 wide
              <input
                className="input input--file"
                type="file"
                multiple={false}
                required
                accept=".png, .jpg, .jpeg"
                onChange={(e) => onSelectFile(e)}
              />
            </label>
            {/*{selectedFile && <img src={preview} />}*/}
          </div>

          <div className="form__footer">
            <button className="btn btn--green" type="submit">
              Add
            </button>
            <button
              className="btn btn--red"
              onClick={(e) => closeModalHandler(e)}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default React.memo(UserModalItem);
