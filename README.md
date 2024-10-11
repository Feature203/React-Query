# React Query

- Initial Value Global

- Stale : là sau 0s sẽ được coi là data cũ => nếu thiết lập stale:60\*1000 thì sau 1 phút thì sẽ được coi là data cũ

```ts
main.ts => Global
const queryClient = new QueryClient();
------------------------------------------------------------
+ Global
<QueryClientProvider client={queryClient}>
    <App />
</QueryClientProvider>
------------------------------
App.tsx

const query = new useQueryClient(
    {
        queryKey:[],
        queryFn:() => {
           axios.get('http://localhost:port',{
            params:{
                page:1,
                limit:10
            },
            headers
           });
        }
    }
);

- call api

```
