/* eslint-disable */
import { ImageResponse } from 'next/server';


export const runtime = 'edge';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const userContent=searchParams.get('userContent')
    const totalSize=searchParams.get('totalSize')

    return new ImageResponse(
        (
            <div
                style={{
                    display: 'flex',
                    fontSize: 60,
                    color: 'black',
                    background: 'rgb(8 47 73)',
                    width: '100%',
                    height: '100%',
                    paddingTop: 50,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >

                {(code && userContent  )? (
                    <div
                        tw={"w-full flex flex-col items-center"}
                    >
                        <p tw={"text-xl text-slate-400"}>{userContent}</p>

                        <div
                            tw={`inline-block bg-gray-900 p-2 text-lg font-medium rounded-md text-slate-300 font-mono max-w-sm`}
                        >
                            {code}
                        </div>
                        <div tw={"w-full flex justify-center overflow-auto"}>
                            {
                                totalSize ?
                                        <h1 tw={"font-medium text-white font-mono text-4xl"}>{totalSize} records found</h1>
                                     :
                                        <h1 tw={"font-medium text-4xl text-white font-mono"}>0 records found</h1>

                           }
                        </div>
                    </div>
                ) : (
                    <h1 tw={"text-slate-400 font-bold text-4xl mt-8"}>
                        No query found
                    </h1>
                )}
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
