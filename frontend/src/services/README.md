# Serviços Globais - Nexus API Social App

Este diretório contém os serviços globais utilizados em toda a aplicação para comunicação com o backend. O principal arquivo é o `crudService.js` que fornece funções reutilizáveis para operações CRUD (Create, Read, Update, Delete) e outras funcionalidades.

## crudService.js

O arquivo `crudService.js` é a principal camada de serviços da aplicação, servindo como ponte entre os componentes de frontend e a API do backend. Ele está organizado em três seções principais:

### 1. Funções de Autenticação e Identificação

| Função | Descrição |
|--------|-----------|
| `ensureUserId()` | Obtém o ID do usuário logado de várias fontes (NextAuth, JWT, localStorage) |
| `isCurrentUserOwner(resourceId)` | Verifica se o usuário atual é o proprietário de um recurso |
| `getAuthToken()` | Recupera o token de autenticação atual |
| `isAuthenticated()` | Verifica se o usuário está autenticado |
| `getAuthHeaders()` | Gera os cabeçalhos de autorização para requisições |

### 2. Operações CRUD e API

| Função | Descrição |
|--------|-----------|
| `list(resource, params)` | Lista recursos com paginação e filtros |
| `getById(resource, id)` | Busca um recurso específico por ID |
| `create(resource, data)` | Cria um novo recurso |
| `update(resource, id, data)` | Atualiza um recurso existente |
| `remove(resource, id)` | Remove um recurso |
| `count(resource, params)` | Conta o número de recursos com filtros |
| `search(resource, query, params)` | Busca recursos com texto livre |
| `options(resource)` | Recupera opções permitidas para um recurso (OPTIONS HTTP) |
| `head(resource, id)` | Verifica a existência de um recurso (HEAD HTTP) |
| `upsert(resource, id, data)` | Cria ou atualiza um recurso (PUT) |

### 3. Operações em Lote

| Função | Descrição |
|--------|-----------|
| `bulkCreate(resource, items)` | Cria vários recursos de uma vez |
| `bulkUpdate(resource, updates)` | Atualiza vários recursos de uma vez |
| `bulkDelete(resource, ids)` | Remove vários recursos de uma vez |

### 4. Utilidades de Processamento de Imagens

| Função | Descrição |
|--------|-----------|
| `isValidImageBase64(base64String)` | Verifica se uma string é uma imagem base64 válida |
| `getImageMimeType(base64String)` | Extrai o tipo MIME de uma string base64 |
| `getImageSrc(imageData, options)` | Retorna URL formatada para imagens (base64 ou URL) |
| `getBase64ImageSize(base64String)` | Estima o tamanho em bytes de uma string base64 |
| `formatImageSize(bytes)` | Formata tamanhos de arquivos (KB, MB, GB) |
| `fileToBase64(file)` | Converte arquivos para base64 |
| `preloadImage(src)` | Pré-carrega uma imagem para melhorar a experiência do usuário |

## Como Usar

Para utilizar o crudService em seus componentes, siga este fluxo:

### 1. Serviços Específicos por Componente

Conforme a arquitetura da aplicação, cada componente deve ter seu próprio serviço que consome o crudService global:

```javascript
// src/components/example/services/ExampleServices.jsx
import { list, create, update, remove } from '@/services/crudService';

const resource = 'examples'; // Nome do recurso na API

// Listar exemplos com filtros
export function fetchExamples(params) {
  return list(resource, params);
}

// Criar um novo exemplo
export function createExample(data) {
  return create(resource, data);
}

// Atualizar um exemplo
export function updateExample(id, data) {
  return update(resource, id, data);
}

// Remover um exemplo
export function deleteExample(id) {
  return remove(resource, id);
}
```

### 2. Integração com o Padrão de Fluxo

Este serviço deve ser consumido no arquivo de utils e não diretamente nos componentes:

```javascript
// src/components/example/utils/ExampleUtils.js
import { useState, useEffect } from 'react';
import { fetchExamples, createExample, updateExample, deleteExample } from '../services/ExampleServices';

export const useExampleData = () => {
  const [examples, setExamples] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Carregar exemplos
  const loadExamples = async () => {
    setLoading(true);
    try {
      const data = await fetchExamples();
      setExamples(data);
    } catch (error) {
      console.error('Erro ao carregar exemplos:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Hook para carregar exemplos automaticamente
  useEffect(() => {
    loadExamples();
  }, []);
  
  // Função para criar exemplo
  const addExample = async (data) => {
    const newExample = await createExample(data);
    setExamples([...examples, newExample]);
    return newExample;
  };
  
  // Retorna dados e funções para o componente
  return {
    examples,
    loading,
    loadExamples,
    addExample,
    // Outras funções...
  };
};
```

### 3. Uso com TanStack Query (React Query)

Para componentes que precisam de gerenciamento de estado mais avançado:

```javascript
// src/components/example/utils/ExampleQueryUtils.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchExamples, createExample } from '../services/ExampleServices';

export const useExampleQuery = () => {
  const queryClient = useQueryClient();
  
  // Consulta para obter exemplos
  const { data: examples = [], isLoading } = useQuery({
    queryKey: ['examples'],
    queryFn: () => fetchExamples()
  });
  
  // Mutação para criar exemplo
  const createMutation = useMutation({
    mutationFn: (data) => createExample(data),
    onSuccess: () => {
      // Invalidar e recarregar consultas após sucesso
      queryClient.invalidateQueries(['examples']);
    }
  });
  
  return {
    examples,
    isLoading,
    createExample: createMutation.mutate
  };
};
```

### 4. Uso no Componente

Finalmente, seu componente consome apenas o hook do utils:

```javascript
// src/components/example/components/ExampleComp.jsx
import React from 'react';
import { useExampleQuery } from '../utils/ExampleQueryUtils';

function ExampleComp() {
  const { examples, isLoading, createExample } = useExampleQuery();
  
  if (isLoading) {
    return <div>Carregando...</div>;
  }
  
  return (
    <div>
      <h2>Exemplos</h2>
      <ul>
        {examples.map(example => (
          <li key={example._id}>{example.title}</li>
        ))}
      </ul>
      <button onClick={() => createExample({ title: 'Novo Exemplo' })}>
        Adicionar
      </button>
    </div>
  );
}

export default ExampleComp;
```

## Boas Práticas

1. **Separação de Responsabilidades**: 
   - Serviços globais (`crudService.js`) fornecem funcionalidade geral
   - Serviços específicos de componentes consomem o serviço global
   - Utils consomem serviços específicos
   - Componentes consomem apenas utils

2. **Validação de IDs**: Sempre que manipular IDs MongoDB, use as funções `validate` e `format` do diretório `/id`.

3. **Autenticação**: O serviço já sincroniza tokens entre NextAuth e localStorage automaticamente.

4. **Manipulação de Erros**: Implemente tratamento de erros adequado nos seus serviços específicos.

5. **Cache**: Considere utilizar TanStack Query para otimizar requisições e caching.
