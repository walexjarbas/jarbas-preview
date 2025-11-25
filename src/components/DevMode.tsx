import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

export const DevMode: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localStorageData, setLocalStorageData] = useState<Record<string, any>>({});

  const refreshData = () => {
    const jarbasKeys = [
      'jarbas_complete_config',
      'jarbas_selected_agent',
      'jarbas_msg_list',
      'jarbas_msg_ai',
      'jarbas_guidelines',
      'jarbas_personalization_fields',
      'jarbas_entry_mode',
      'jarbas_conversation_type',
      'jarbas_request_evaluation',
      'jarbas_active_config'
    ];

    const data: Record<string, any> = {};
    jarbasKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        try {
          data[key] = JSON.parse(value);
        } catch {
          data[key] = value;
        }
      } else {
        data[key] = null;
      }
    });

    setLocalStorageData(data);
  };

  useEffect(() => {
    refreshData();
    
    // Listen for storage changes
    const handleStorageChange = () => refreshData();
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for any localStorage updates in the same tab
    const interval = setInterval(refreshData, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const clearAllData = () => {
    const jarbasKeys = Object.keys(localStorageData);
    jarbasKeys.forEach(key => localStorage.removeItem(key));
    refreshData();
  };

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  };

  const getValueType = (value: any): string => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsExpanded(true)}
          variant="outline"
          size="sm"
          className="bg-background/90 backdrop-blur-sm"
        >
          🛠️ Dev Mode
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[60vh] overflow-hidden bg-background/95 backdrop-blur-sm border-t">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">🛠️ Dev Mode - localStorage Data</h3>
            <Badge variant="secondary">{Object.keys(localStorageData).filter(k => localStorageData[k] !== null).length} keys</Badge>
          </div>
          <div className="flex gap-2">
            <Button onClick={refreshData} variant="outline" size="sm">
              🔄 Refresh
            </Button>
            <Button onClick={clearAllData} variant="destructive" size="sm">
              🗑️ Clear All
            </Button>
            <Button onClick={() => setIsExpanded(false)} variant="outline" size="sm">
              ✕ Close
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4 max-h-[40vh] overflow-y-auto">
          {Object.entries(localStorageData).map(([key, value]) => (
            <Card key={key} className="p-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-semibold">{key}</span>
                  <Badge variant={value === null ? "secondary" : "default"} className="text-xs">
                    {getValueType(value)}
                  </Badge>
                </div>
                {value !== null && (
                  <Button 
                    onClick={() => {
                      localStorage.removeItem(key);
                      refreshData();
                    }}
                    variant="ghost" 
                    size="sm"
                    className="h-6 w-6 p-0"
                  >
                    ✕
                  </Button>
                )}
              </div>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-32">
                {formatValue(value)}
              </pre>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};