import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const socket = io('http://localhost:5000'); // Connect to backend

const Chat = ({ userId, receiverId }: { userId: string, receiverId: string }) => {
    const [messages, setMessages] = useState<{ senderId: string, text: string }[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        // Join room with own userId
        socket.emit('join', { userId });

        // Listen for incoming messages
        socket.on('message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.off('message');
        };
    }, [userId]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            // Emitting to backend
            socket.emit('sendMessage', { senderId: userId, receiverId, text: input });
            // Add to local UI immediately
            setMessages((prev) => [...prev, { senderId: userId, text: input }]);
            setInput('');
        }
    };

    return (
        <Card className="w-[350px] h-[400px] flex flex-col fixed bottom-4 right-4 shadow-xl z-50">
            <CardHeader className="py-3 bg-blue-600 text-white rounded-t-lg">
                <CardTitle className="text-sm">Chat Support</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`max-w-[80%] rounded-lg p-2 text-sm ${msg.senderId === userId ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                        {msg.text}
                    </div>
                ))}
            </CardContent>
            <CardFooter className="p-2 border-t">
                <form onSubmit={sendMessage} className="flex w-full gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="h-8 text-sm"
                    />
                    <Button type="submit" size="sm" className="h-8">Send</Button>
                </form>
            </CardFooter>
        </Card>
    );
};

export default Chat;
