import React, { useMemo } from 'react';
import { Container, Row, Col, Form, Button, Table, Modal, Alert, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaFileDownload, FaFilter } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import { useTransacoes } from '../utils/TransacoesUtils';
import { TransacoesStyles } from '../styles/TransacoesStyles';
import { useTheme } from '../../../shared/contexts/ThemeContext';

const TransacoesComp = () => {
  const { isDarkMode } = useTheme();
  const {
    transacoes,
    contas,
    categorias,
    formData,
    isLoading,
    error,
    showModal,
    filtro,
    editingId,
    handleChange,
    handleFilterChange,
    handleEdit,
    handleAdd,
    handleSave,
    handleDelete,
    setShowModal,
    formatCurrency,
    formatDate
  } = useTransacoes();

  // Preparando dados para o gráfico de pizza (distribuição por categoria)
  const pieChartData = useMemo(() => {
    const categoriasMap = new Map();
    
    // Agrupa transações por categoria
    transacoes.forEach(transacao => {
      const categoriaId = transacao.categoriaId;
      const valor = transacao.tipo === 'DESPESA' ? transacao.valor : 0;
      
      if (valor > 0) {
        if (categoriasMap.has(categoriaId)) {
          categoriasMap.set(categoriaId, categoriasMap.get(categoriaId) + valor);
        } else {
          categoriasMap.set(categoriaId, valor);
        }
      }
    });
    
    // Encontra nomes de categorias
    const labels = [];
    const data = [];
    const backgroundColors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
      '#FF9F40', '#8AC926', '#1982C4', '#6A4C93', '#FF595E'
    ];
    
    Array.from(categoriasMap.entries()).forEach(([categoriaId, valor], index) => {
      const categoria = categorias.find(cat => cat.id === categoriaId);
      labels.push(categoria ? categoria.nome : 'Desconhecido');
      data.push(valor);
    });
    
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors.slice(0, data.length),
        borderWidth: 1
      }]
    };
  }, [transacoes, categorias]);

  // Preparando dados para o gráfico de barras (entrada x saída ao longo do tempo)
  const barChartData = useMemo(() => {
    // Agrupar transações por mês
    const monthlyData = new Map();
    
    transacoes.forEach(transacao => {
      const date = new Date(transacao.data);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthlyData.has(monthYear)) {
        monthlyData.set(monthYear, { receitas: 0, despesas: 0 });
      }
      
      const entry = monthlyData.get(monthYear);
      if (transacao.tipo === 'RECEITA') {
        entry.receitas += transacao.valor;
      } else {
        entry.despesas += transacao.valor;
      }
    });
    
    // Ordenar os meses cronologicamente
    const sortedMonths = Array.from(monthlyData.keys()).sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);
      return yearA !== yearB ? yearA - yearB : monthA - monthB;
    });
    
    return {
      labels: sortedMonths,
      datasets: [
        {
          label: 'Receitas',
          data: sortedMonths.map(month => monthlyData.get(month).receitas),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        },
        {
          label: 'Despesas',
          data: sortedMonths.map(month => monthlyData.get(month).despesas),
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgb(255, 99, 132)',
          borderWidth: 1
        }
      ]
    };
  }, [transacoes]);

  // Cálculo do resumo financeiro
  const resumo = useMemo(() => {
    let totalReceitas = 0;
    let totalDespesas = 0;
    
    transacoes.forEach(transacao => {
      if (transacao.tipo === 'RECEITA') {
        totalReceitas += transacao.valor;
      } else {
        totalDespesas += transacao.valor;
      }
    });
    
    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas
    };
  }, [transacoes]);

  // Função para exportar os dados para CSV
  const exportToCSV = () => {
    // Cabeçalho do CSV
    let csv = 'Data,Descrição,Valor,Tipo,Categoria,Conta,Observação\n';
    
    // Adiciona cada transação
    transacoes.forEach(transacao => {
      const categoria = categorias.find(cat => cat.id === transacao.categoriaId);
      const conta = contas.find(c => c.id === transacao.contaId);
      
      csv += `${formatDate(transacao.data)},`;
      csv += `"${transacao.descricao.replace(/"/g, '""')}",`;
      csv += `${transacao.valor},`;
      csv += `${transacao.tipo},`;
      csv += `"${categoria ? categoria.nome : 'N/A'}",`;
      csv += `"${conta ? conta.nome : 'N/A'}",`;
      csv += `"${transacao.observacao ? transacao.observacao.replace(/"/g, '""') : ''}"\n`;
    });
    
    // Criar blob e link para download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transacoes_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <TransacoesStyles.StyledContainer fluid>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {isLoading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Carregando...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {/* Resumo financeiro */}
          <Row className="mb-4">
            <Col md={4}>
              <TransacoesStyles.StyledCard className={isDarkMode ? 'bg-dark text-white' : ''}>
                <div className="card-body">
                  <h5 className="card-title">Receitas</h5>
                  <p className="card-text text-success">{formatCurrency(resumo.totalReceitas)}</p>
                </div>
              </TransacoesStyles.StyledCard>
            </Col>
            <Col md={4}>
              <TransacoesStyles.StyledCard className={isDarkMode ? 'bg-dark text-white' : ''}>
                <div className="card-body">
                  <h5 className="card-title">Despesas</h5>
                  <p className="card-text text-danger">{formatCurrency(resumo.totalDespesas)}</p>
                </div>
              </TransacoesStyles.StyledCard>
            </Col>
            <Col md={4}>
              <TransacoesStyles.StyledCard className={isDarkMode ? 'bg-dark text-white' : ''}>
                <div className="card-body">
                  <h5 className="card-title">Saldo</h5>
                  <p className={`card-text ${resumo.saldo >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(resumo.saldo)}
                  </p>
                </div>
              </TransacoesStyles.StyledCard>
            </Col>
          </Row>
          
          {/* Gráficos */}
          <Row className="mb-4">
            <Col lg={6}>
              <TransacoesStyles.StyledCard className={isDarkMode ? 'bg-dark text-white' : ''}>
                <div className="card-body">
                  <h5 className="card-title">Despesas por Categoria</h5>
                  <TransacoesStyles.ChartContainer>
                    {pieChartData.labels.length > 0 ? (
                      <Pie 
                        data={pieChartData} 
                        options={{
                          plugins: {
                            legend: {
                              position: 'right',
                              labels: {
                                color: isDarkMode ? 'white' : 'black'
                              }
                            }
                          }
                        }}
                      />
                    ) : (
                      <p className="text-center my-5">Sem dados para exibir</p>
                    )}
                  </TransacoesStyles.ChartContainer>
                </div>
              </TransacoesStyles.StyledCard>
            </Col>
            <Col lg={6}>
              <TransacoesStyles.StyledCard className={isDarkMode ? 'bg-dark text-white' : ''}>
                <div className="card-body">
                  <h5 className="card-title">Receitas x Despesas</h5>
                  <TransacoesStyles.ChartContainer>
                    {barChartData.labels.length > 0 ? (
                      <Bar 
                        data={barChartData} 
                        options={{
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: {
                                color: isDarkMode ? 'white' : 'black'
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                color: isDarkMode ? 'white' : 'black'
                              },
                              grid: {
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                              }
                            },
                            x: {
                              ticks: {
                                color: isDarkMode ? 'white' : 'black'
                              },
                              grid: {
                                color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                              }
                            }
                          }
                        }}
                      />
                    ) : (
                      <p className="text-center my-5">Sem dados para exibir</p>
                    )}
                  </TransacoesStyles.ChartContainer>
                </div>
              </TransacoesStyles.StyledCard>
            </Col>
          </Row>
          
          {/* Filtros e Botões */}
          <Row className="mb-4">
            <Col>
              <TransacoesStyles.StyledCard className={isDarkMode ? 'bg-dark text-white' : ''}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="card-title">
                    <FaFilter className="me-2" />
                    Filtros
                  </h5>
                  <div>
                    <TransacoesStyles.ResponsiveButton variant="success" className="me-2" onClick={handleAdd}>
                      <FaPlus className="me-1" /> Nova Transação
                    </TransacoesStyles.ResponsiveButton>
                    <TransacoesStyles.ResponsiveButton variant="secondary" onClick={exportToCSV}>
                      <FaFileDownload className="me-1" /> Exportar
                    </TransacoesStyles.ResponsiveButton>
                  </div>
                </div>
                
                <TransacoesStyles.ResponsiveForm inline="true" className="mb-3">
                  <Row>
                    <TransacoesStyles.ResponsiveCol xs={12} md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Data Início</Form.Label>
                        <Form.Control 
                          type="date" 
                          name="dataInicio" 
                          value={filtro.dataInicio} 
                          onChange={handleFilterChange}
                          className={isDarkMode ? 'bg-dark text-white' : ''} 
                        />
                      </Form.Group>
                    </TransacoesStyles.ResponsiveCol>
                    <TransacoesStyles.ResponsiveCol xs={12} md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label>Data Fim</Form.Label>
                        <Form.Control 
                          type="date" 
                          name="dataFim" 
                          value={filtro.dataFim} 
                          onChange={handleFilterChange} 
                          className={isDarkMode ? 'bg-dark text-white' : ''}
                        />
                      </Form.Group>
                    </TransacoesStyles.ResponsiveCol>
                    <TransacoesStyles.ResponsiveCol xs={12} md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tipo</Form.Label>
                        <Form.Select 
                          name="tipo" 
                          value={filtro.tipo} 
                          onChange={handleFilterChange}
                          className={isDarkMode ? 'bg-dark text-white' : ''}
                        >
                          <option value="TODOS">Todos</option>
                          <option value="RECEITA">Receita</option>
                          <option value="DESPESA">Despesa</option>
                        </Form.Select>
                      </Form.Group>
                    </TransacoesStyles.ResponsiveCol>
                    <TransacoesStyles.ResponsiveCol xs={12} md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Categoria</Form.Label>
                        <Form.Select 
                          name="categoria" 
                          value={filtro.categoria} 
                          onChange={handleFilterChange}
                          className={isDarkMode ? 'bg-dark text-white' : ''}
                        >
                          <option value="TODOS">Todas</option>
                          {categorias.map(categoria => (
                            <option key={categoria.id} value={categoria.id}>
                              {categoria.nome}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </TransacoesStyles.ResponsiveCol>
                    <TransacoesStyles.ResponsiveCol xs={12} md={2}>
                      <Form.Group className="mb-3">
                        <Form.Label>Conta</Form.Label>
                        <Form.Select 
                          name="conta" 
                          value={filtro.conta} 
                          onChange={handleFilterChange}
                          className={isDarkMode ? 'bg-dark text-white' : ''}
                        >
                          <option value="TODOS">Todas</option>
                          {contas.map(conta => (
                            <option key={conta.id} value={conta.id}>
                              {conta.nome}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </TransacoesStyles.ResponsiveCol>
                  </Row>
                </TransacoesStyles.ResponsiveForm>
              </TransacoesStyles.StyledCard>
            </Col>
          </Row>
          
          {/* Lista de Transações */}
          <Row>
            <Col>
              <TransacoesStyles.StyledCard className={isDarkMode ? 'bg-dark text-white' : ''}>
                <div className="card-body">
                  <h5 className="card-title">Transações</h5>
                  <div className="table-responsive">
                    <TransacoesStyles.StyledTable striped bordered hover className={isDarkMode ? 'table-dark' : ''}>
                      <thead>
                        <tr>
                          <th>Data</th>
                          <th>Descrição</th>
                          <th>Valor</th>
                          <th>Tipo</th>
                          <th>Categoria</th>
                          <th>Conta</th>
                          <th>Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transacoes.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center">Nenhuma transação encontrada</td>
                          </tr>
                        ) : (
                          transacoes.map(transacao => {
                            const categoria = categorias.find(c => c.id === transacao.categoriaId);
                            const conta = contas.find(c => c.id === transacao.contaId);
                            
                            return (
                              <tr key={transacao.id}>
                                <td>{formatDate(transacao.data)}</td>
                                <td>{transacao.descricao}</td>
                                <td className={transacao.tipo === 'RECEITA' ? 'text-success' : 'text-danger'}>
                                  {formatCurrency(transacao.valor)}
                                </td>
                                <td>{transacao.tipo === 'RECEITA' ? 'Receita' : 'Despesa'}</td>
                                <td>{categoria ? categoria.nome : 'N/A'}</td>
                                <td>{conta ? conta.nome : 'N/A'}</td>
                                <td>
                                  <Button 
                                    variant="outline-primary" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleEdit(transacao)}
                                  >
                                    <FaEdit />
                                  </Button>
                                  <Button 
                                    variant="outline-danger" 
                                    size="sm"
                                    onClick={() => handleDelete(transacao.id)}
                                  >
                                    <FaTrash />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </TransacoesStyles.StyledTable>
                  </div>
                </div>
              </TransacoesStyles.StyledCard>
            </Col>
          </Row>
        </>
      )}
      
      {/* Modal para adicionar/editar transação */}
      <TransacoesStyles.StyledModal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        keyboard={false}
        centered
        className={isDarkMode ? 'dark-modal' : ''}
      >
        <Modal.Header closeButton className={isDarkMode ? 'bg-dark text-white' : ''}>
          <Modal.Title>{editingId ? 'Editar Transação' : 'Nova Transação'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? 'bg-dark text-white' : ''}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                placeholder="Digite a descrição"
                required
                className={isDarkMode ? 'bg-dark text-white' : ''}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="text"
                name="valor"
                value={formData.valor}
                onChange={handleChange}
                placeholder="0.00"
                required
                className={isDarkMode ? 'bg-dark text-white' : ''}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                name="data"
                value={formData.data}
                onChange={handleChange}
                required
                className={isDarkMode ? 'bg-dark text-white' : ''}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                required
                className={isDarkMode ? 'bg-dark text-white' : ''}
              >
                <option value="RECEITA">Receita</option>
                <option value="DESPESA">Despesa</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className={isDarkMode ? 'bg-dark text-white' : ''}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Conta</Form.Label>
              <Form.Select
                name="conta"
                value={formData.conta}
                onChange={handleChange}
                required
                className={isDarkMode ? 'bg-dark text-white' : ''}
              >
                <option value="">Selecione uma conta</option>
                {contas.map(conta => (
                  <option key={conta.id} value={conta.id}>
                    {conta.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Observação</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="observacao"
                value={formData.observacao}
                onChange={handleChange}
                placeholder="Observações adicionais"
                className={isDarkMode ? 'bg-dark text-white' : ''}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className={isDarkMode ? 'bg-dark text-white' : ''}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar
          </Button>
        </Modal.Footer>
      </TransacoesStyles.StyledModal>
    </TransacoesStyles.StyledContainer>
  );
};

export default TransacoesComp; 