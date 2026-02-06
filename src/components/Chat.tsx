import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Construct socket URL dynamically to support network access
import { socket } from '@/lib/socket';

const Chat = ({ userId, receiverId, onClose }: { userId: string, receiverId: string, onClose: () => void }) => {
    const [messages, setMessages] = useState<{ senderId: string, text: string }[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Notification sound from public folder
    const notificationSound = '/notificationsound.wav';

    const playNotificationSound = () => {
        try {
            const audio = new Audio(notificationSound);
            audio.play().catch(e => console.error("Error playing sound:", e));
        } catch (error) {
            console.error("Audio playback failed", error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Fetch conversation history
        const fetchHistory = async () => {
            try {
                const res = await api.get(`/messages/${receiverId}`);
                setMessages(res.data.map((msg: any) => ({
                    senderId: msg.sender,
                    text: msg.text
                })));
            } catch (err) {
                console.error("Failed to fetch messages", err);
            }
        };

        if (receiverId) {
            fetchHistory();
        }

        // Join logic (wrapped for reuse)
        const joinRoom = () => {
            socket.emit('join', { userId });
        };

        // Initial join
        if (socket.connected) {
            joinRoom();
        }

        // Listen for connection events (reconnects)
        socket.on('connect', joinRoom);

        // Define handler
        const handleMessage = (message: { senderId: string, text: string }) => {
            // Ignore own messages (handled optimistically)
            if (message.senderId === userId) return;

            playNotificationSound();
            setMessages((prev) => [...prev, message]);
        };

        socket.on('message', handleMessage);

        return () => {
            socket.off('connect', joinRoom);
            socket.off('message', handleMessage);
        };
    }, [userId, receiverId]);

    const sendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            socket.emit('sendMessage', { senderId: userId, receiverId, text: input });
            setMessages((prev) => [...prev, { senderId: userId, text: input }]);
            setInput('');
        }
    };

    return (
        <Card className="w-[350px] h-[450px] flex flex-col fixed bottom-4 right-4 shadow-xl z-50 bg-background border-border">
            <CardHeader className="py-3 bg-primary text-primary-foreground rounded-t-lg flex flex-row items-center justify-between shadow-sm">
                <CardTitle className="text-sm font-semibold">Chat Support</CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary/80" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900/50">
                {messages.length === 0 && (
                    <div className="text-center text-xs text-muted-foreground mt-4">Start a conversation...</div>
                )}
                {messages.map((msg, idx) => {
                    const isMe = msg.senderId === userId;
                    return (
                        <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div
                                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${isMe
                                    ? 'bg-primary text-primary-foreground rounded-br-none'
                                    : 'bg-muted text-muted-foreground border border-border/50 rounded-bl-none font-medium'
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                {isMe ? 'You' : 'User'}
                            </span>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
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
