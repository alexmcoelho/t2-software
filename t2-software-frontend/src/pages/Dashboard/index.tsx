import React, { useCallback, useEffect, useState } from 'react';
import { FiPower, FiPlusSquare, FiEdit3, FiTrash } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/Pagination';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Section,
  Table,
} from './style';

import ModalAdd from '../../components/ModalAdd';
import ModalEdit from '../../components/ModalEdit';
import logoImg from '../../assets/logo.svg';
import avatarImg from '../../assets/avatar.svg';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formattingCPF, formattingPhone } from '../../utils/masks';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface IUserResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  createAt: string;
  updateAt: string;
  avatar_url: string;
}

const Dashboard: React.FC = () => {
  const { addToast } = useToast();
  const { signOut, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [editing, setEditing] = useState<User>({} as User);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const findUsers = async (page?: number): Promise<any> => {
    if (page) {
      return api.get(`/users?page=${page}`);
    }
    return api.get(`/users`);
  };

  const loadUsers = useCallback(async (): Promise<void> => {
    const response = await findUsers();
    setUsers(response.data.content);
    setTotalElements(response.data.totalElements);
    setTotalPages(response.data.totalPages);
    setCurrentPage(0);
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const loadUsersForPage = useCallback(async (page: number): Promise<void> => {
    const response = await findUsers(page);
    setUsers(response.data.content);
  }, []);

  useEffect(() => {
    loadUsersForPage(currentPage);
  }, [currentPage, loadUsersForPage]);

  const formatCpf = useCallback((cpf: string): string => {
    return formattingCPF(cpf);
  }, []);

  const formatPhone = useCallback((phone: string): string => {
    return formattingPhone(phone);
  }, []);

  const handleloadUsers = useCallback(async (): Promise<void> => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = useCallback(
    async (id: string): Promise<void> => {
      try {
        await api.delete(`/users/${id}`);
        loadUsers();
        addToast({
          type: 'success',
          title: 'Exclusão realizada com sucesso',
          description: 'Registro excluído',
        });
      } catch (error) {
        addToast({
          type: 'error',
          title: 'Erro na exclusão',
          description: error.response
            ? error.response.data.message
            : 'Ocorreu um erro ao excluir registro',
        });
      }
    },
    [addToast, loadUsers],
  );

  const toggleModal = useCallback((): void => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const toggleEditModal = useCallback((): void => {
    setEditModalOpen(!editModalOpen);
  }, [editModalOpen]);

  const handleEdit = useCallback(
    (u: User): void => {
      setEditing(u);
      toggleEditModal();
    },
    [toggleEditModal],
  );

  function setEdit(u: User): void {
    handleEdit(u);
  }

  const paginate = useCallback(async (num: number): Promise<void> => {
    setCurrentPage(num);
    const response = await findUsers(num);
    setUsers(response.data.content);
  }, []);

  const previous = useCallback(async (): Promise<void> => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const next = useCallback(async (): Promise<void> => {
    if (totalPages > currentPage + 1) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Gobarber" />
          <Profile>
            {user.avatar_url && <img src={user.avatar_url} alt={user.name} />}
            {!user.avatar_url && <img src={avatarImg} alt="Avatar" />}
            <div>
              <span>Bem-vindo, </span>
              <Link to="/profile">
                <strong>{user.name}</strong>
              </Link>
            </div>
          </Profile>
          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>
      <Content>
        <Schedule>
          <h1>Lista de usuários</h1>
          <button
            type="button"
            onClick={toggleModal}
            className="button-new-user"
          >
            <div className="text">Novo Usuário</div>
            <div className="icon">
              <FiPlusSquare size={24} />
            </div>
          </button>
          <ModalAdd
            isOpen={modalOpen}
            setIsOpen={toggleModal}
            handleAdd={handleloadUsers}
          />
          <ModalEdit
            isOpen={editModalOpen}
            setIsOpen={toggleEditModal}
            editing={editing}
            handleUpdate={handleloadUsers}
          />
          <Section>
            <Table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>CPF</th>
                  <th> </th>
                </tr>
              </thead>
              <tbody>
                {users &&
                  users.map(u => (
                    <tr key={u.id}>
                      <td>{u.name}</td>
                      <td>{formatPhone(u.phone)}</td>
                      <td>{formatCpf(u.cpf)}</td>
                      <td>
                        <div className="icon-container">
                          <button
                            type="button"
                            className="icon"
                            onClick={() => setEdit(u)}
                            data-testid={`edit-food-${u.id}`}
                          >
                            <FiEdit3 size={20} />
                          </button>

                          <button
                            type="button"
                            className="icon"
                            onClick={() => handleDelete(u.id)}
                            data-testid={`remove-food-${u.id}`}
                          >
                            <FiTrash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </Section>
          <div style={{ flex: 1 }}>
            <Pagination
              paginate={paginate}
              linesPerpage={5}
              totalElements={totalElements}
              currentPage={currentPage}
              previous={previous}
              next={next}
            />
          </div>
        </Schedule>
      </Content>
    </Container>
  );
};

export default Dashboard;
