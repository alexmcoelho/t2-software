import React, { useRef, useCallback } from 'react';
import * as Yup from 'yup';
import { FiMail, FiLock, FiUser, FiPhone, FiArchive } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import InputMask from '../InputMask';
import Button from '../Button';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import getValidationErrors from '../../utils/getValidationErrors';

interface ICreateUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleAdd: () => void;
}

const ModalAddFood: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleAdd,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ICreateUser) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
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
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });
        await api.post('/users', data);

        handleAdd();
        setIsOpen();
        addToast({
          type: 'success',
          title: 'Cadastro realizado com sucesso',
          description: 'Registro inserido',
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
    [addToast, handleAdd, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo usuário</h1>
        <Input name="name" icon={FiUser} placeholder="Nome" />
        <Input name="email" icon={FiMail} placeholder="E-mail" />
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
        <Input
          name="password"
          icon={FiLock}
          type="password"
          placeholder="Senha"
        />
        <Button type="submit">Cadastrar</Button>
      </Form>
    </Modal>
  );
};

export default ModalAddFood;
