import React, { ChangeEvent, useCallback, useRef } from 'react';
import {
  FiArrowLeft,
  FiMail,
  FiLock,
  FiUser,
  FiCamera,
  FiPhone,
  FiArchive,
} from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import getValidationErrors from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../context/AuthContext';
import InputMask from '../../components/InputMask';
import avatarImg from '../../assets/avatar.svg';

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  oldPassword: string;
  passwordConfirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
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
          oldPassword: Yup.string(),
          password: Yup.string().when('oldPassword', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          passwordConfirmation: Yup.string()
            .when('oldPassword', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), undefined], 'Confirmação incorreta'),
        });
        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          phone,
          cpf,
          oldPassword,
          password,
          passwordConfirmation,
        } = data;
        const complement = {
          oldPassword,
          password,
          passwordConfirmation,
        };
        const formData = {
          name,
          email,
          phone,
          cpf,
          ...(oldPassword ? complement : {}),
        };
        const response = await api.put('/profile', formData);
        updateUser(response.data);
        history.push('/');
        addToast({
          type: 'success',
          title: 'Pefil atualizado',
          description:
            'Suas informações do perfil foram atualizadas com sucesso!',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'success',
          title: 'Erro na atualização',
          description: error.response
            ? error.response.data.message
            : 'Ocorreu um erro ao excluir registro',
        });
      }
    },
    [addToast, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();
        data.append('avatar', e.target.files[0]);
        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar atualiado',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>
      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
            phone: user.phone,
            cpf: user.cpf,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            {user.avatar_url && <img src={user.avatar_url} alt={user.name} />}
            {!user.avatar_url && <img src={avatarImg} alt="Avatar" />}
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>Meu perfil</h1>

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
            containerStyle={{ marginTop: 24 }}
            name="oldPassword"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
          />
          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
          />
          <Input
            name="passwordConfirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
          />
          <Button type="submit">Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
