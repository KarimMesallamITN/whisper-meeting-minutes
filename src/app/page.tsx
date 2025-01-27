import VoiceRecorder from '@/components/VoiceRecorder';

export default function Home() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">محضر الاجتماع الصوتي</h1>
        <p className="mt-2 text-gray-600">انقر على الزر للبدء في التسجيل</p>
      </header>
      
      <VoiceRecorder />
    </div>
  );
}