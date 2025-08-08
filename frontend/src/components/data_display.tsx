import {QueryClientContext, useQuery} from '@tanstack/react-query';
import apiClient from '../api/client';
import {Component, type JSX, useContext} from "react";

// Define a base API response type
interface BaseApiResponse {
    success: boolean;
    message?: string;
}

// Generic component props
interface DataDisplayProps<T> {
    endpoint: string;
    queryKey: string | string[];
    render?: (data: T) => JSX.Element;
}

// Default renderer component
class JsonDisplay extends Component<{ data: unknown }> {
    render() {
        const {data} = this.props;
        return (
            <pre className="bg-gray-100 p-4 rounded">
    {JSON.stringify(data, null, 2)}
  </pre>
        );
    }
}

function Data_display<T extends BaseApiResponse = BaseApiResponse>(
    {
        endpoint,
        queryKey,
        render = (data) => <JsonDisplay data={data}/>
    }: DataDisplayProps<T> = {} as DataDisplayProps<T>
) {
    console.log('QueryClientContext value:', useContext(QueryClientContext));
    const {data, isLoading, isError, error} = useQuery<T>({
        queryKey: Array.isArray(queryKey) ? queryKey : [queryKey],
        queryFn: () => apiClient.get<T>(endpoint).then(res => res.data)
    });

    if (isLoading) return <div>Loading...</div>;

    if (isError) {
        return (
            <div className="text-red-500">
                Error: {error instanceof Error ? error.message : 'Unknown error'}
            </div>
        );
    }

    return render(data!);
}

export default Data_display;