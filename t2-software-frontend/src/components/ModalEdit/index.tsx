import React, { useRef, useCallback, useEffect, useState } from 'react';

import { FiArchive, FiMail, FiPhone, FiUser } from 'react-icons/fi';
import * as Yup from 'yup';
import { FormHandles } from '@unform/core';
import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import InputMask from '../InputMask';
import Button from '../Button';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { useToast } from '../../context/ToastContext';
import { formattingCPF, formattingPhone } from '../../utils/masks';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleUpdate: () => void;
  editing: User;
}

interface IEditData {
  name: string;
  phone: string;
  cpf: string;
}

const ModalEditFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  editing,
  handleUpdate,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    if (Object.keys(editing).length > 0) {
      setUser({
        ...editing,
        cpf: formattingCPF(editing.cpf),
        phone: formattingPhone(editing.phone),
      });
    }
  }, [editing]);

  const handleSubmit = useCallback(
    async (data: IEditData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          phone: Yup.string()
            .required('Telefone obrigatório')
            .matches(
              /(\(?\d{2}\)?\s)?(\d{4,5})-(\d{4})/,
              'Tem que estar nesse formato (11) 1111-1111 ou (11) 11111-1111',
            ),
          cpf: Yup.string()
            .required('CPF obrigatório')
            .matches(
              /([0-9]{2}[\\.]?[0-9]{3}[\\.]?[0-9]{3}[\\/]?[0-9]{4}[-]?[0-9]{2})|([0-9]{3}[\\.]?[0-9]{3}[\\.]?[0-9]{3}[-]?[0-9]{2})/,
              'Tem que estar nesse formato 111.111.111-11',
            ),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        const dataUpdate = {
          cpf: data.cpf,
          phone: data.phone,
          name: data.name,
        } as IEditData;
        await api.put(`/users/${editing.id}`, dataUpdate);

        handleUpdate();
        setIsOpen();
        addToast({
          type: 'success',
          title: 'Alteração realizada com sucesso',
          description: 'Registro alterado',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: error.response
            ? error.response.data.message
            : 'Ocorreu um erro ao excluir registro',
        });
      }
    },
    [addToast, editing.id, handleUpdate, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit} initialData={user}>
        <h1>Editar Prato</h1>
        <Input name="name" icon={FiUser} placeholder="Nome" />
        <Input name="email" icon={FiMail} placeholder="E-mail" readOnly />
        <InputMask
          name="phone"
          icon={FiPhone}
          placeholder="Telefone"
          typeMask="phone"
        />
        <InputMask
          name="cpf"
          icon={FiArchive}
          placeholder="CPF"
          typeMask="cpf"
        />

        <Button type="submit">Editar</Button>
      </Form>
    </Modal>
  );
};

export default ModalEditFood;
